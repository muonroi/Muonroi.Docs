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
