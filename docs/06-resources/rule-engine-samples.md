# Rule Engine Samples

This page lists runnable sample projects for the upgraded rule engine.

## Repository paths

- `MuonroiBuildingBlock/Samples/DecisionTableDemo`
- `MuonroiBuildingBlock/Samples/FeelPlayground`

## 1. DecisionTableDemo

Purpose:

- Build decision table in code.
- Validate and export to workflow JSON + DMN XML.
- Convert rows to typed rules and execute via orchestrator.

Run:

```bash
dotnet run --project D:\Personal\Project\MuonroiBuildingBlock\Samples\DecisionTableDemo\DecisionTableDemo.csproj
```

## 2. FeelPlayground

Purpose:

- Evaluate FEEL expressions interactively.
- Verify new features: open/closed ranges, function definitions, context expressions.

Run interactive:

```bash
dotnet run --project D:\Personal\Project\MuonroiBuildingBlock\Samples\FeelPlayground\FeelPlayground.csproj
```

Run one-shot expression:

```bash
dotnet run --project D:\Personal\Project\MuonroiBuildingBlock\Samples\FeelPlayground\FeelPlayground.csproj -- "5 in (1..10)"
```

## 3. Template Workflow API (Base/Micro/Modular)

Purpose:

- Verify new workflow adapter (`MRuleWorkflowRunner<TContext>`) in real template-generated apps.
- Validate both rule path and traditional path through one API.

Endpoint:

```http
GET /api/v1/rules/workflow/{value}?mode=Rules
GET /api/v1/rules/workflow/{value}?mode=Traditional
```

Expected output:

- `result.executedSteps`: `start > evaluate-rules > route > even-branch/odd-branch > end`
- `result.facts.workflowDecision`
- `result.facts.riskLevel`
- `result.state.traditionalPathUsed` when `mode=Traditional`
