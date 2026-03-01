# RuleGen Phase 3: Developer Experience

## Objective

Standardize team workflows with config + automation.

## Delivered

- Config auto-load support:
  - `.rulegenrc.json`
  - `.rulegen.json`
  - override with `--config`
- `watch` command for incremental regeneration loop.
- `generate-tests` command for xUnit test scaffolds from generated rules.
- VS Code extension scaffold under `tools/Muonroi.RuleGen/vscode-extension`:
  - `extractAll`
  - `mergeRuntime`
  - `splitHandler`

## Sample `.rulegenrc.json`

```json
{
  "extract": {
    "sourceDir": "src/Handlers",
    "outputDir": "src/Generated/Rules",
    "namespace": "MyApp.Generated.Rules",
    "pattern": "**/*Handler.cs",
    "excludePatterns": ["**/Legacy/**"],
    "validate": true,
    "parallel": true
  },
  "conventions": {
    "requirePartialForMerge": true
  }
}
```

Reference sample file in repository:
- `tools/Muonroi.RuleGen/.rulegenrc.example.json`

## Usage

```bash
muonroi-rule extract --config .rulegenrc.json
muonroi-rule watch --config .rulegenrc.json
muonroi-rule generate-tests --rules ./src/Generated/Rules --output ./tests/GeneratedRules
```
