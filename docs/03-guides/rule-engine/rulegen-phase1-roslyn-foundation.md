# RuleGen Phase 1: Roslyn Foundation

## Objective

Replace regex extraction with Roslyn and remove `TODO` body placeholders in generated rules.

## Delivered

- Roslyn AST parsing for methods marked by `[MExtractAsRule]`.
- Extract metadata: `Code`, `Order`, `HookPoint`, `DependsOn`.
- Extract method body/expression body and map into generated `EvaluateAsync`.
- Return-type mapping support:
  - `RuleResult`, `Task<RuleResult>`
  - `bool`, `Task<bool>`
  - `Task`, `void`
  - fallback `T`/`Task<T>` (stored in `FactBag`)

## Usage

```bash
muonroi-rule extract \
  --source ./src/Handlers \
  --output ./src/Generated/Rules \
  --namespace MyApp.Generated.Rules
```

## Result

Generated `.g.cs` now contains executable logic copied from source method body and no TODO placeholders.
