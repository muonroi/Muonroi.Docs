# Rule Engine Dependencies Guide

## 1. Dependency model

A rule can depend on:

- `DependsOn` (rule code references)
- `Dependencies` (rule type references)

Both are topologically sorted before execution.

## 2. Validation behavior

Execution fails fast when:

- dependency code is missing;
- dependency type is missing;
- circular dependency is detected.

## 3. Example

```csharp
public sealed class ApplyDiscountRule : IRule<OrderContext>
{
    public string Code => "APPLY_DISCOUNT";
    public IReadOnlyList<string> DependsOn => ["VALIDATE_STOCK"];
}
```

## 4. Recommended practices

- Keep dependency chains short.
- Use stable rule codes.
- Avoid hidden side effects between unrelated rules.
- Add contract tests to detect accidental cycles.
