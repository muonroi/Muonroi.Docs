# Rule Engine Testing Guide

This guide provides practical testing patterns for Muonroi Rule Engine.

## 1. Unit test for a single rule

Use isolated context + `FactBag` and assert `RuleResult`.

```csharp
[Fact]
public async Task ValidatePriceRule_ShouldFail_WhenPriceIsNegative()
{
    var rule = new ValidatePriceRule();
    var ctx = new ProductContext { Price = -1 };
    var facts = new FactBag();

    var result = await rule.EvaluateAsync(ctx, facts, CancellationToken.None);

    Assert.False(result.IsSuccess);
}
```

## 2. Orchestrator integration test

Verify order/dependencies and shared facts:

```csharp
var orchestrator = new RuleOrchestrator<OrderContext>(rules, hooks, logger);
var facts = await orchestrator.ExecuteAsync(context);
Assert.True(facts.Get<bool>("validated"));
```

## 3. External dependency mocking

- Inject HTTP/gRPC clients through constructor.
- Use mocks/fakes in tests.
- Keep network calls out of rule unit tests.

## 4. Contract tests

Recommended contracts:

- Every registered rule has unique `Code`.
- Dependency graph has no cycles.
- Required hook points for your workflow are covered.

## 5. Property-based checks

For complex dependency graphs, generate random DAGs and assert:

- no cycle accepted;
- cycle always rejected;
- deterministic topological order for same input.

## 6. Toolkit support

Use `Muonroi.RuleEngine.Testing` package:

- `MRuleTestBuilder<TContext>`
- `MRuleOrchestratorSpy<TContext>`
- `FactBagAssertions.Should(...)`
