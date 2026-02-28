# Rule Engine Guide

The Muonroi rule engine lets you split business logic into small reusable rules. It supports strongly typed rules written in C# and dynamic workflows described in JSON. This guide walks through the common tasks required to use the engine in your application.

The component is optional and ships with the `Muonroi.BuildingBlock` NuGet package to handle complex business validations. Projects that do not need a rule engine can simply omit its registration.

## Quick start

1. **Create a rule** – implement `IRule<T>` and set any outputs in a `FactBag`.
2. **Register it** – add rules and optional `IHookHandler<T>` implementations to the DI container.
3. **Execute the engine** – resolve a `RuleOrchestrator<T>` and call `ExecuteAsync` with your context.

```csharp
public sealed class PositiveRule : IRule<int>
{
    public string Name => "Positive";
    public string Code => "POS";
    public int Order => 0;
    public IReadOnlyList<string> DependsOn => Array.Empty<string>();
    public HookPoint HookPoint => HookPoint.BeforeRule;
    public RuleType Type => RuleType.Validation;
    public IEnumerable<Type> Dependencies => Array.Empty<Type>();

    public Task ExecuteAsync(int context, CancellationToken token = default) => Task.CompletedTask;

    public Task<RuleResult> EvaluateAsync(int context, FactBag facts, CancellationToken token = default)
    {
        bool ok = context > 0;
        facts["positive"] = ok;
        return Task.FromResult(ok ? RuleResult.Passed() : RuleResult.Failure("Number must be positive"));
    }
}

services.AddRuleEngine().AddRulesFromAssemblies(typeof(PositiveRule).Assembly);

await using var provider = services.BuildServiceProvider();
RuleOrchestrator<int> orchestrator = provider.GetRequiredService<RuleOrchestrator<int>>();
FactBag facts = await orchestrator.ExecuteAsync(5);
bool ok = facts.Get<bool>("positive");
```

The returned `FactBag` aggregates outputs from previous rules so later rules can build on earlier work.

## End-to-end example: payment approval

For a complete business scenario the `PaymentApproval` sample chains several rules to authorize a payment request:

1. `CheckRequesterRoleRule` calls a REST API to verify the creator has the **requester** role.
2. `FetchWorkflowRule` pulls workflow configuration from a BPMN service.
3. `BudgetCheckRule` uses a gRPC client to ensure sufficient budget.
4. `FinancialApprovalRule` posts the request to the finance system and returns the decision.

One of the rules is implemented as follows:

```csharp
public sealed class CheckRequesterRoleRule : IRule<PaymentApprovalContext>
{
    public string Name => "check-requester-role";
    public IEnumerable<Type> Dependencies => Array.Empty<Type>();

    public async Task<RuleResult> EvaluateAsync(PaymentApprovalContext context, FactBag facts, CancellationToken token = default)
    {
        using HttpClient client = new();
        var roles = await client.GetFromJsonAsync<List<string>>($"https://example.com/users/{context.CreatorId}/roles", token) ?? [];
        bool isRequester = roles.Contains("requester", StringComparer.OrdinalIgnoreCase);
        facts["IsRequester"] = isRequester;
        return isRequester ? RuleResult.Passed() : RuleResult.Failed("Creator must have requester role.");
    }
}
```

After registering the rules you can execute the workflow end to end:

```csharp
public sealed record PaymentApprovalContext(string CreatorId, decimal Amount);

var services = new ServiceCollection();
services.AddSingleton<IBudgetGrpcClient, FakeBudgetClient>();
services.AddRulesFromAssemblies(typeof(CheckRequesterRoleRule).Assembly);

await using var provider = services.BuildServiceProvider();
var orchestrator = provider.GetRequiredService<RuleOrchestrator<PaymentApprovalContext>>();
var context = new PaymentApprovalContext("user1", 1000m);

FactBag facts = await orchestrator.ExecuteAsync(context);
if (facts.TryGetValue("ApprovalResult", out var result) && result is ApprovalResult approval)
{
    Console.WriteLine($"Approved: {approval.Approved}");
}

public interface IBudgetGrpcClient
{
    Task<bool> CheckBudgetAsync(decimal amount, CancellationToken token = default);
}

sealed class FakeBudgetClient : IBudgetGrpcClient
{
    public Task<bool> CheckBudgetAsync(decimal amount, CancellationToken token = default) => Task.FromResult(true);
}
```

Each rule contributes facts (`IsRequester`, `WorkflowInfo`, `BudgetSufficient`, `ApprovalResult`) so later steps can depend on earlier outcomes. See `Samples/PaymentApproval` for the full source.

## Strongly typed rules

Rules implement `IBusinessRule<TContext>` and expose an `IsSatisfiedAsync` method. Extension methods `And` and `Or` let you compose complex specifications while retaining compile‑time safety.

```csharp
public sealed class MinimumAmountRule : IBusinessRule<Order>
{
    public string Code => "MIN";
    public Task<bool> IsSatisfiedAsync(Order order, CancellationToken token = default)
        => Task.FromResult(order.Total >= 100);
}
```

## Externalized rules

Dynamic rules can be described in JSON and evaluated at runtime through the [Microsoft RulesEngine](https://github.com/microsoft/RulesEngine). `ExternalJsonRule<TContext>` loads workflow definitions and checks them against the provided context without requiring recompilation.

```csharp
const string json = """
[
  {
    "WorkflowName": "NumberWorkflow",
    "Rules": [
      {
        "RuleName": "IsEven",
        "RuleExpressionType": "LambdaExpression",
        "Expression": "input1.value % 2 == 0"
      }
    ]
  }
]
""";

IBusinessRule<int> external = new ExternalJsonRule<int>(json, "NumberWorkflow");
```

## Combining approaches

Because both approaches implement `IBusinessRule<TContext>`, they can be composed together. This lets applications mix compile‑time rules with dynamically loaded ones.

```csharp
IBusinessRule<int> combined = new PositiveRule().And(external);
bool result = await combined.IsSatisfiedAsync(4); // true
```

## Versioned JSON workflows

`RulesEngineService` allows applications to load and execute JSON workflows without recompilation. Rulesets are saved via an `IRuleSetStore` implementation (for example, the on‑disk `FileRuleSetStore`) and each execution returns a `FactBag` containing outputs from rule actions.

```csharp
FileRuleSetStore store = new("rules");
RulesEngineService service = new(store);
await service.SaveRuleSetAsync("NumberWorkflow", json);
FactBag bag = await service.ExecuteAsync("NumberWorkflow", 3);
int result = bag.Get<int>("Double");
```

To avoid hard‑coding fully qualified type names inside rule expressions you can register custom types through `ReSettings` and pass them to the service:

```csharp
ReSettings settings = new() { CustomTypes = new[] { typeof(MyRuleHelpers) } };
RulesEngineService service = new(store, settings);
```

Versions can be rolled back by selecting a previous version:

```csharp
await service.SetActiveVersionAsync("NumberWorkflow", 1);
```

## Execution flow

The rule engine executes a set of `IRule<T>` implementations. Each rule is described by a `RuleDescriptor` that contains a unique code, friendly name, description, hook point, execution order and optional dependencies. At runtime the engine filters the registered rules by:

- requested `RuleType` hook points;
- an optional list of rule codes;
- configuration toggles supplied through `RuleOptions`;
- an `IRuleActivationStrategy<T>` feature flag.

After filtering, the rules are sorted so that any items listed in `DependsOn` run first. Missing or circular dependencies will throw an `InvalidOperationException` before any rule is executed.

When `ExecuteAsync` is called:

1. A transaction is opened if the context implements `ITransactionalRuleContext`.
2. Each rule's `ExecuteAsync` method runs sequentially.
3. Failures stop the pipeline and are logged; execution time and outcomes are recorded via OpenTelemetry metrics.
4. The transaction commits or rolls back based on the overall success.

The `RuleOrchestrator<TContext>` in the `Muonroi.RuleEngine.Core` package builds on the same ideas and adds `HookPoint` callbacks. Implementing `IHookHandler<TContext>` lets applications react before or after each rule, or when errors occur, without cluttering business logic.

## Security & compliance

The rule engine provides optional components to meet security and regulatory requirements:

* **Artifact signing** – `FileRuleSetStore` accepts an `IRuleSetSigner` so stored JSON workflows are signed and verified before execution.
* **RBAC and audit trail** – register an `AuditTrailHook<T>` to capture rule execution events and integrate them with your authorization system.
* **Data minimization** – `AuditTrailHook<T>` projects the context via a callback, allowing sensitive fields to be removed before logging.
* **Policy enforcement** – an external policy engine such as [Open Policy Agent](https://www.openpolicyagent.org/) can evaluate access policies before rules run.

## Safe rollout and risk control

Rules can be deployed with safeguards to limit the blast radius of changes:

- **Feature flags** – implement `IRuleActivationStrategy<T>` and back it with a provider such as [Unleash](https://www.getunleash.io/) to enable a kill switch or gradually roll out by tenant, user segment or percentage.
- **Canary releases** – run two rule versions in parallel and use progressive delivery tools like [Argo Rollouts](https://argo-rollouts.readthedocs.io/) to shift traffic while monitoring an error budget.
- **Shadow evaluation** – execute the new rule set in dry-run mode and compare outputs with the live version before fully enabling it.

See the [Rule Rollout Guide](rule-rollout-guide.md) for practical steps.

## Related guides

- [Rule Engine Testing Guide](rule-engine-testing-guide.md)
- [Rule Engine External Services Guide](rule-engine-external-services.md)
- [Rule Engine Hooks Guide](rule-engine-hooks-guide.md)
- [Rule Engine Configuration Reference](rule-engine-configuration-reference.md)
- [Rule Engine Dependencies Guide](rule-engine-dependencies.md)
- [Rule Engine Advanced Patterns](rule-engine-advanced-patterns.md)

## Runtime and performance

For large fact sets and low latency, rule engines benefit from incremental pattern matching algorithms such as Rete and Phreak. NRules builds a Rete network, while [Drools](https://docs.drools.org/latest/drools-docs/html_single/) explains its Phreak engine and inference model. Tuning sessions and retained facts to match the workload avoids unnecessary recalculation.

### Conflict resolution and agenda control

Salience (priority), activation/agenda groups and `AgendaFilter` let you control the order in which rules fire. See the [JBoss documentation](https://docs.jboss.org/drools/release/latest/drools-docs/html_single/) and the [Drools documentation](https://docs.drools.org/latest/drools-docs/html_single/#_rule_agenda) for details.

### Pre-compilation and benchmarking

Compile or warm up rules ahead of time, pool sessions, and use GC-friendly payloads to reduce latency spikes. Benchmark both batch and streaming profiles to verify performance characteristics.

