# Multi-Tenant Guide

The library isolates tenant data through `TenantContext`. `TenantContextMiddleware` resolves the `tenantId` for each request and stores it in `TenantContext.CurrentTenantId`.

The middleware checks multiple sources in order:

1. JWT claim `tenant_id` (default claim name).
2. Header `x-tenant-id` (default header name).
3. Subdomain of the host. For `tenant.example.com` the resolved id is `tenant`.

## Common tenant strategies

| Strategy | Description |
|-----------|-------------|
| Shared DB + TenantId | All tenants share one database with a `TenantId` column. `MDbContext` automatically filters and adds an index for this column. |
| DB-per-tenant | Each tenant has its own connection string. `ITenantConnectionStringFactory` maps the `tenantId` to the appropriate connection string. |
| Schema-per-tenant | Tenants share a server but use different schemas. The `tenantId` can be mapped to a connection string that includes the target schema. |

## Configuration

```csharp
// Bind from configuration and register when Enabled = true
services.AddTenantContext(builder.Configuration);
app.UseMiddleware<TenantContextMiddleware>();
```

### Custom tenant resolvers

`ITenantIdResolver` exposes a single method `Task<string?> ResolveTenantIdAsync(HttpContext context)`. Implement and register your own resolver to pull the id from other sources (gRPC, database, etc.).

```csharp
public class HeaderTenantResolver : ITenantIdResolver
{
    public Task<string?> ResolveTenantIdAsync(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("X-Tenant-Id", out var header))
        {
            return Task.FromResult<string?>(header.ToString());
        }
        return Task.FromResult<string?>(null);
    }
}

// Registration
services.AddTenantIdResolver<HeaderTenantResolver>();
```

### Default tenant and fallback

If requests may come without an explicit tenant, configure a default tenant and fall back to it when resolution fails:

```json
"TenantConfigs": {
  "DefaultTenant": "tenant1"
}
```

A resolver can read this value as a fallback:

```csharp
public class FallbackTenantResolver : ITenantIdResolver
{
    private readonly IConfiguration _configuration;
    public FallbackTenantResolver(IConfiguration configuration) => _configuration = configuration;

    public Task<string?> ResolveTenantIdAsync(HttpContext context)
    {
        string? tenantId = context.User.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrWhiteSpace(tenantId))
        {
            tenantId = _configuration["TenantConfigs:DefaultTenant"];
        }
        return Task.FromResult(tenantId);
    }
}
```

In `MDbContext`, queries are automatically filtered by `TenantContext.CurrentTenantId` when an entity defines a `TenantId` property or implements `ITenantScoped`.

> **Note**: Only entities that have a `TenantId` property (or implement `ITenantScoped`) are automatically filtered.

`MDbContext` also creates an index (`HasIndex`) on the `TenantId` column to improve performance and enforce data segregation.

## Separate connections per tenant

When each tenant uses a different database, the library maps the `tenantId` to a connection string via `ITenantConnectionStringFactory`. By default, all tenants use the same connection string, but you can provide a mapping in configuration:

```json
"TenantConnectionStrings": {
  "tenant1": "Server=.;Database=tenant1_db;Trusted_Connection=True",
  "tenant2": "Server=.;Database=tenant2_db;Trusted_Connection=True"
}
```

`MappingTenantConnectionStringFactory` will pick the connection string matching `TenantContext.CurrentTenantId` for each request.

You can also implement `ITenantConnectionStringFactory` to pull configuration from other sources:

```csharp
public class CustomConnectionStringFactory : ITenantConnectionStringFactory
{
    private readonly IConfiguration _configuration;

    public CustomConnectionStringFactory(IConfiguration configuration)
        => _configuration = configuration;

    public string GetConnectionString(string? tenantId)
    {
        return _configuration[$"Tenants:{tenantId}:Connection"]
            ?? _configuration.GetConnectionString("DefaultConnection")!;
    }
}

services.AddSingleton<ITenantConnectionStringFactory, CustomConnectionStringFactory>();
```

### Schema-per-tenant

If the database supports schemas (e.g., PostgreSQL), map the `tenantId` to a connection string with the appropriate `SearchPath`:

```json
"TenantConnectionStrings": {
  "tenant1": "Host=...;Database=main;SearchPath=tenant1",
  "tenant2": "Host=...;Database=main;SearchPath=tenant2"
}
```

Or configure the schema dynamically in `OnModelCreating`:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.HasDefaultSchema(TenantContext.CurrentTenantId);
    base.OnModelCreating(modelBuilder);
}
```

## Multi-tenant logging

Serilog is configured with `TenantIdEnricher` to automatically attach `TenantId`, `UserId`, and `CorrelationId` to all logs or events. You can route logs to different sinks per tenant as needed.

## Examples

- [Quickstart: Multi-Tenant API with JWT & RBAC](../../01-getting-started/quickstart-multi-tenant-api.md)
- Sample code:
  - Program: [Samples/MultiTenant/Program.cs](https://github.com/muonroi/Muonroi.Docs/blob/main/Samples/MultiTenant/Program.cs)
  - Service: [Samples/MultiTenant/TenantExampleService.cs](https://github.com/muonroi/Muonroi.Docs/blob/main/Samples/MultiTenant/TenantExampleService.cs)
