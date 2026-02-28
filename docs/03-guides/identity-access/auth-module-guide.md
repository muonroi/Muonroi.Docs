# Auth, AuthZ, BFF and Multi-Tenant Guide

This guide describes how to configure authentication, authorization, BFF and multi-tenant modules in Muonroi Building Block.

**Related Guides**

- [Token Guide](token-guide.md)
- [External Auth Guide](external-auth-guide.md)
- [BFF Guide](security/bff.md)
- [OPA Integration Guide](opa-integration-guide.md)

## Auth module (Authentication)

### Recommended setup (JWT + MVC Filter)

Use ASP.NET Core JWT Bearer with a post-routing action filter to validate token state (revocation/rotation) — this guarantees endpoint metadata like `[AllowAnonymous]` is available and avoids `GetEndpoint()` nulls.

```csharp
// Program.cs (builder.Services)
services.AddValidateBearerToken<MyDbContext, MTokenInfo, MyPermission>(configuration);
services.AddAuthTokenValidation<MyDbContext, MyPermission>(); // registers RequireAuthenticatedTokenFilter

// Program.cs (app)
app.UseRouting();
app.UseCors("MAllowDomains");
app.UseMiddleware<TenantContextMiddleware>();
app.UseDefaultMiddleware<MyDbContext, MyPermission>(); // MExceptionMiddleware + MCookieAuthMiddleware
app.UseAuthentication();
app.UseAuthorization();
app.ConfigureEndpoints(); // MapControllers + Swagger
```

- `AddValidateBearerToken` wires standard JWT validation and populates `HttpContext.User`.
- `AddAuthTokenValidation` adds `RequireAuthenticatedTokenFilter` globally, which:
  - Respects `[AllowAnonymous]` and only enforces validation on `[Authorize]` endpoints.
  - Validates token state via DB/Redis using `DefaultRefreshTokenValidator`.
- `UseDefaultMiddleware` includes exception and cookie helpers. It no longer injects token-validation middleware.

`MCookieAuthMiddleware` is useful for BFF apps that store access tokens in secure cookies. When `TokenConfigs.EnableCookieAuth` is enabled and the `Authorization` header is missing, the middleware reads the cookie (default `AuthToken`), decodes it and attaches the header.

### Issue tokens

```csharp
string access = MAuthenticateTokenHelper.CreateAccessToken(user);
```

### Built-in APIs in `MAuthControllerBase`

This base controller exposes endpoints to manage users and permissions:

- `POST /login`, `POST /refresh-token`, `POST /logout`, `POST /logout-all`.
- `POST /register` to create new users.
- `POST /create-role`, `POST /assign-role`, `POST /assign-permission`, `DELETE /remove-permission/{roleId}/{permissionId}`.
- `GET /roles`, `GET /permissions`, `GET /role-permissions/{roleId}`, `GET /user-permissions/{userId}`.
- `GET /permission-definitions` and `GET /permission-tree/{userId}` for syncing and caching permissions on the frontend.

These endpoints cache permissions in `user_permissions:{userId}`. Clear the cache when roles or permissions change.

## Authorization (AuthZ)

Add permission filter and dynamic attribute:

```csharp
services.AddPermissionFilter<MyPermission>();
services.AddDynamicPermission<MyDbContext>();
```

Use `[AuthorizePermission(MyPermission.ViewUser)]` to restrict by permission.

## BFF

```csharp
services.AddBffAuthentication();
```

`AddBffAuthentication` configures a `Secure`, `HttpOnly`, `SameSite=Strict` cookie and registers an `ITokenStore` to keep refresh tokens on the server.

`ITokenStore` is an interface for storing refresh tokens. The default `InMemoryTokenStore` is suitable only for development. Implement and register a custom store (e.g., Redis or database) for production.

In an SPA + BFF setup, the frontend only holds an auth cookie. The SPA calls the BFF, which reads the access token from the cookie, retrieves the refresh token via `ITokenStore` when needed, and calls downstream APIs. This keeps tokens off the browser and mitigates XSS.

### OPA Authorization

For finer-grained access control, integrate `OpaAuthorizationService` before proxying to downstream services. See the [OPA Integration Guide](opa-integration-guide.md) for configuring the OPA server and .NET client.

## Multi-Tenant

```csharp
services.AddTenantContext(builder.Configuration);
app.UseMiddleware<TenantContextMiddleware>();
```

`TenantContextMiddleware` resolves `tenantId` from claim, header or subdomain and stores it in `TenantContext.CurrentTenantId`. Implement `ITenantIdResolver` for custom resolution.

## Full Sample

```csharp
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder.Services.AddBffAuthentication();
builder.Services.AddAuthorization();
builder.Services.AddPermissionFilter<MyPermission>();
builder.Services.AddTenantContext(builder.Configuration);

WebApplication app = builder.Build();
app.UseMiddleware<TenantContextMiddleware>();
app.UseMiddleware<JwtMiddleware>();
app.UseMiddleware<MAuthenMiddleware<MyDbContext, MyPermission>>();
```

See `Samples/AuthAuthzBff` for an end-to-end flow with OIDC, OPA and BFF.

Refer to the [BFF Guide](security/bff.md) and [OPA Integration Guide](opa-integration-guide.md) for detailed configuration.

