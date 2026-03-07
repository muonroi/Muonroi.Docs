# Your First Rule

This walkthrough shows a minimal code-first rule using Muonroi abstractions.

## 1. Define your context

```csharp
public sealed class LoanApplication
{
    public int CreditScore { get; set; }
    public decimal MonthlyIncome { get; set; }
    public decimal MonthlyDebt { get; set; }
}
```

## 2. Implement a rule

```csharp
using Muonroi.RuleEngine.Abstractions;

[RuleGroup("loan-approval")]
public sealed class CreditScoreRule : IRule<LoanApplication>
{
    public string Code => "CREDIT_SCORE";
    public int Order => 0;

    public Task<RuleResult> EvaluateAsync(LoanApplication context, FactBag facts, CancellationToken ct)
    {
        bool eligible = HasMinimumCreditScore(context.CreditScore);
        facts.Set("creditScoreEligible", eligible);
        return Task.FromResult(eligible ? RuleResult.Passed() : RuleResult.Failure("Credit score must be >= 650."));
    }

    [MExtractAsRule("CREDIT_SCORE", Order = 0)]
    private static bool HasMinimumCreditScore(int creditScore) => creditScore >= 650;
}
```

## 3. Register and execute

```csharp
builder.Services.AddRuleEngine<LoanApplication>();
builder.Services.AddRulesFromAssemblies(typeof(Program).Assembly);
```

Then inject `RuleOrchestrator<LoanApplication>` and call `ExecuteAsync(...)`.

## 4. Next step

- [LoanApproval sample](../06-resources/samples/loan-approval.md)
