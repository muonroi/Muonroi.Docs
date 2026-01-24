# NRules Integration

[NRules](https://github.com/NRules/NRules) is a lightweight rules engine for .NET. The following example demonstrates how to integrate it with **Muonroi.BuildingBlock** and enable/disable rules based on database flags.

## 1. Install Packages

```bash
dotnet add package NRules
```

## 2. Define a Rule

```csharp
public class DiscountRule : Rule
{
    public override void Define()
    {
        Customer customer = null!;

        When()
            .Match(() => customer, c => c.IsVip);

        Then()
            .Do(ctx => Console.WriteLine($"{customer.Name} receives VIP discount"));
    }
}
```

## 3. Load Rules with Feature Flags

```csharp
IRuleRepository repository = new RuleRepository();
repository.Load(x => x.From(typeof(DiscountRule).Assembly));
ISessionFactory factory = repository.Compile();

using IDbConnection db = new SqlConnection(connString);
var activeRules = db.Query<string>("SELECT Name FROM Rules WHERE IsActive = 1");
ISession session = factory.CreateSession();

foreach (string rule in activeRules)
{
    session.ActivateRule(rule);
}

session.Insert(new Customer { Name = "Alice", IsVip = true });
session.Fire();
```

In this snippet, rule activation is driven by a table `Rules(Name, IsActive)`. Updating the table toggles rules without redeploying the service.

