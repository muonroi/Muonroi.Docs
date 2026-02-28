# Rule Workflow Adapter Guide

`Muonroi.RuleEngine.Core` now includes a lightweight workflow adapter so you can orchestrate:

- rule tasks (`IMRuleExecutionRouter<TContext>`)
- service tasks (custom code blocks)
- exclusive gateways (branching)
- explicit start/end steps

This provides BPMN-like control flow without introducing a heavy external workflow runtime.

## 1. Core types

- `IMRuleWorkflowRunner<TContext>`
- `MRuleWorkflowDefinition<TContext>`
- `MRuleWorkflowStep<TContext>`
- `MRuleWorkflowExecutionContext<TContext>`
- `MRuleWorkflowResult<TContext>`
- `MRuleWorkflowOptions`

## 2. Registration

For typed workflow execution, register a typed rule engine:

```csharp
services.AddRuleEngine<int>();
services.AddRulesFromAssemblies(typeof(RegisterService).Assembly);
```

Optional loop protection tuning:

```csharp
services.ConfigureRuleWorkflow(o => o.MaxSteps = 512);
```

## 3. Build a workflow

```csharp
var workflow = new MRuleWorkflowDefinition<int>(
    "number-classification-workflow",
    "start",
    [
        MRuleWorkflowStep<int>.Start("start", "evaluate-rules"),
        MRuleWorkflowStep<int>.RuleTask("evaluate-rules", "route"),
        MRuleWorkflowStep<int>.ExclusiveGateway("route", (ctx, _) =>
        {
            var isEven = ctx.Facts.TryGet<bool>("even", out var even) && even;
            return Task.FromResult(isEven ? "even-branch" : "odd-branch");
        }),
        MRuleWorkflowStep<int>.ServiceTask("even-branch", "end", (ctx, _) =>
        {
            ctx.Facts["workflowDecision"] = "approve";
            return Task.CompletedTask;
        }),
        MRuleWorkflowStep<int>.ServiceTask("odd-branch", "end", (ctx, _) =>
        {
            ctx.Facts["workflowDecision"] = "manual-review";
            return Task.CompletedTask;
        }),
        MRuleWorkflowStep<int>.End("end")
    ]);
```

Execute:

```csharp
var result = await workflowRunner.ExecuteAsync(8, workflow, cancellationToken);
```

## 4. Template sample APIs

All 3 templates now expose:

- `GET /api/v1/rules/workflow/{value}?mode=Rules`
- `GET /api/v1/rules/workflow/{value}?mode=Traditional`

Response includes:

- `result.executedSteps`
- `result.facts.workflowDecision`
- `result.facts.riskLevel`
- `result.state.traditionalPathUsed` (when traditional path is used)

## 5. Enterprise-tier verification flow

For generated projects, use enterprise key + activation proof:

1. Generate keys:

```powershell
cd D:\Personal\Project\MuonroiBuildingBlock
.\scripts\flow-license-server.ps1 -Organization "Muonroi Workflow Verify" -NoRunServer
```

2. Activate key on mock server and write these files in each generated app:

- `licenses/license.key`
- `licenses/activation_proof.json`
- `licenses/public.pem` (from `tools/MockLicenseServer/server_public_key.pem`)

3. Set `appsettings.Development.json`:

```json
"LicenseConfigs": {
  "Mode": "Offline",
  "LicenseFilePath": "licenses/license.key",
  "ActivationProofPath": "licenses/activation_proof.json",
  "PublicKeyPath": "licenses/public.pem",
  "FailMode": "Hard",
  "EnforceOnDatabase": true,
  "EnforceOnMiddleware": true
}
```

4. Run app and verify log contains:

- `[License] Verified tier: Enterprise`
- `[License] Verified using activation proof (offline)`

## 6. Troubleshooting

- `500` on workflow endpoint with handler activation error:
  - ensure `services.AddRuleEngine<TContext>()` is registered for the workflow context type.
- Workflow never reaches end step:
  - check transitions and increase `MRuleWorkflowOptions.MaxSteps` only when needed.
- Traditional mode fails:
  - provide a `traditionalPath` delegate for `MRuleWorkflowStep.RuleTask(...)` when using `RuleExecutionMode.Traditional`.
