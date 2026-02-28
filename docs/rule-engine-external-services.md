# Rule Engine External Services Guide

This guide covers calling REST/gRPC services from rule implementations safely.

## 1. REST integration pattern

```csharp
public sealed class ContainerValidationRule : IRule<ContainerContext>
{
    private readonly HttpClient _client;
    public ContainerValidationRule(HttpClient client) => _client = client;

    public async Task<RuleResult> EvaluateAsync(ContainerContext ctx, FactBag facts, CancellationToken ct)
    {
        var response = await _client.GetAsync($"/containers/{ctx.ContainerId}", ct);
        return response.IsSuccessStatusCode ? RuleResult.Passed() : RuleResult.Failure("Container not valid");
    }
}
```

## 2. gRPC integration pattern

- Inject generated gRPC client via DI.
- Keep timeout + cancellation token explicit.

## 3. Resilience baseline

- Retry for transient failures.
- Timeout per rule call.
- Circuit breaker for unstable downstream systems.

## 4. Error handling

- Convert transport errors to deterministic business messages.
- Avoid leaking internal endpoint details into public error messages.
- Write details to telemetry/logs instead.

## 5. Multi-tenant safety

- Pass tenant ID when calling downstream services.
- Reject cross-tenant responses at rule boundary.
