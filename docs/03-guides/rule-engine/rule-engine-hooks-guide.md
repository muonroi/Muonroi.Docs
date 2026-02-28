# Rule Engine Hooks Guide

Hook handlers let you run cross-cutting logic around rule execution.

## Hook points

- `BeforeRule`
- `AfterRule`
- `Error`

Additional domain hook points can be used through rule metadata (for example CRUD lifecycle points).

## 1. Logging hook

```csharp
public sealed class LoggingHook<TContext> : IHookHandler<TContext>
{
    public Task HandleAsync(HookPoint point, IRule<TContext> rule, RuleResult result,
        FactBag facts, TContext context, TimeSpan? duration, CancellationToken token)
    {
        // Write structured logs
        return Task.CompletedTask;
    }
}
```

## 2. Audit hook

- Capture rule code, decision, tenant, and user identity.
- Mask sensitive fields before persistence.

## 3. Error hook

- Normalize exception payloads.
- Attach correlation IDs for incident triage.

## 4. Performance hook

- Emit duration metrics per rule.
- Alert on p95/p99 regression.
