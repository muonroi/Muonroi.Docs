# Token Guide

See [Auth/AuthZ/BFF Guide](auth-module-guide.md) for overall setup.

Use standard JWT bearer authentication and a post-routing MVC filter to validate token state (revocation/rotation) with access to endpoint metadata.

```csharp
// Services
services.AddValidateBearerToken<MyDbContext, MTokenInfo, MyPermission>(configuration);
services.AddAuthTokenValidation<MyDbContext, MyPermission>(); // global action filter

// Pipeline
app.UseRouting();
app.UseDefaultMiddleware<MyDbContext, MyPermission>(); // exception + cookie helper
app.UseAuthentication();
app.UseAuthorization();
app.ConfigureEndpoints();
```

### `MCookieAuthMiddleware`

This middleware reads an encrypted access token from a cookie and attaches it to the `Authorization` header. It is useful for BFF applications where tokens are kept on the server to avoid exposure on the client. Enable the feature in token configuration:

```json
"TokenConfigs": {
  "EnableCookieAuth": true,
  "CookieName": "AuthToken",
  "CookieSameSite": "Lax"
}
```

Use `MAuthenticateTokenHelper` to create access and refresh tokens for users.

## Customize refresh token validation

`DefaultRefreshTokenValidator` validates tokens against DB/Redis and populates `MAuthenticateInfoContext`. Implement `IRefreshTokenValidator` to customize validation (e.g., external store/service).

```csharp
services.AddScoped<IRefreshTokenValidator, MyRefreshTokenValidator>();
```

The `ValidateAsync` implementation should return `MAuthenticateInfoContext` after successful validation.

### Refresh token endpoint

- Keep `POST /api/v1/auth/refresh-token` as `[AllowAnonymous]`.
- The client should include:
  - Header: `Authorization: Bearer <access token>` (can be expired; used to read claims/token key)
  - Body: `{ refreshToken: "..." }`
- On the SPA, if you bypass interceptors for this call, make sure to add the `Authorization` header manually.

