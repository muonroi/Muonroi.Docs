# Rule Engine Configuration Reference

## 1. Runtime mode

```json
{
  "RuleEngine": {
    "ExecutionMode": "Rules",
    "TraditionalWeight": 0.5
  }
}
```

- `ExecutionMode`: `Traditional | Rules | Hybrid | Shadow`
- `TraditionalWeight`: used when mode is `Hybrid`

## 2. Rule store (`RuleStore`)

```json
{
  "RuleStore": {
    "RootPath": "rules",
    "UseContentRoot": true,
    "MaxRuleSetSizeBytes": 262144,
    "RequireSignature": false,
    "AllowedPathSegmentPattern": "^[a-zA-Z0-9._-]+$"
  }
}
```

## 3. Security options

- `RequireSignature`: reject unsigned artifacts when enabled.
- `MaxRuleSetSizeBytes`: guard large payload uploads.
- `AllowedPathSegmentPattern`: tenant/workflow segment validation.

## 4. Dependency injection registration

```csharp
services.AddRuleEngineStore(configuration);
services.AddRuleEngine<MyContext>(o => o.ExecutionMode = RuleExecutionMode.Hybrid)
    .AddRule<MyRule>()
    .AddHook<MyHook>();
```
