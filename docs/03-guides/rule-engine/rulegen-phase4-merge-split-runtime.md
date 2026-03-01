# RuleGen Phase 4: Merge/Split Runtime Workflow

## Objective

Enable bidirectional workflow between runtime-authored rules and developer-maintained code.

## Delivered

- `merge` command:
  - import runtime JSON rules
  - generate/update `*.Generated.cs` partial class
  - class targeting with `--class <Class|Namespace.Class>`
  - conflict strategy: `append|replace|interactive`
  - compile safety with `--compile-check` + auto rollback on failed build
- `split` command:
  - extract `[MExtractAsRule]` methods to generated rules
  - class targeting with `--class <Class|Namespace.Class>`
  - export runtime JSON payload
- FEEL <-> C# translation (best-effort) for condition/action:
  - `and/or/not`, equality, nested path mapping
  - fact assignment mapping: `facts['key'] = value`

## Merge Example

```bash
muonroi-rule merge \
  --rules-json ./runtime/order-validation.v3.json \
  --target ./src/Handlers/OrderHandler.cs \
  --class MyApp.Handlers.OrderHandler \
  --strategy replace \
  --partial-class true \
  --context MyApp.Domain.OrderContext \
  --compile-check true \
  --compile-target ./src/MyService/MyService.csproj
```

## Split Example

```bash
muonroi-rule split \
  --source ./src/Handlers \
  --output-dir ./src/Generated/Rules \
  --export-json ./runtime/order-validation.export.json \
  --workflow order-validation \
  --class MyApp.Handlers.OrderHandler \
  --version 5
```

## Important

For complex business logic, treat exported FEEL as a reviewable baseline and validate with QA before production rollout.
If compile-check fails during merge, the tool restores both target handler and generated file to pre-merge state.
