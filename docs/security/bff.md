# Backend-for-Frontend (BFF) Security

The BFF pattern acts as a dedicated backend for a single-page application (SPA). All
OAuth tokens are handled on the server, and the SPA communicates using cookies that
are not accessible to JavaScript.

## Integration Steps

1. **Register services**: call `services.AddBffAuthentication()` and add `MCookieAuthMiddleware` to automatically attach the access
   token from the cookie.
2. **Map endpoints**: implement `/login` and `/callback` (similar to the OAuth guide). The BFF exchanges the code for tokens and
   stores the refresh token via an `ITokenStore`.
3. **Forward API calls**: the SPA sends requests to the BFF, which appends the access token and invokes internal or downstream
   APIs.
4. **Check policies with OPA** before proxying by using `OpaAuthorizationService`.

## Token Storage Strategy

`ITokenStore` abstracts where refresh tokens are kept. The default `InMemoryTokenStore` is for demos only; implement your own store
backed by Redis or a database:

```csharp
public interface ITokenStore
{
    Task StoreRefreshTokenAsync(string subject, string refreshToken);
    Task<string?> GetRefreshTokenAsync(string subject);
    Task RemoveRefreshTokenAsync(string subject);
}
```

Refresh tokens never leave the server. In an SPA scenario the browser only carries the authentication cookie. When the access
token expires, the BFF retrieves the refresh token from `ITokenStore` to obtain a new one before calling APIs.

## Cookie Configuration

The BFF issues authentication cookies with the following flags:

- **Secure** – transmitted only over HTTPS.
- **HttpOnly** – invisible to client-side scripts.
- **SameSite=Strict** – prevents cross-site request forgery.

A corresponding antiforgery token is also issued to protect state changing requests.
Refresh tokens are stored with an `ITokenStore` on the server and never persisted in
web storage.

## Observability

Integrate the BFF with OpenTelemetry tracing. Recording spans for login and token
exchange operations provides distributed traces that help detect abnormal session
activity and support auditing.

## Best Practices

1. Keep refresh tokens server-side using a secure store.
2. Use short-lived access tokens delivered via secure cookies.
3. Require antiforgery tokens for non-GET requests.
4. Monitor authentication flows with distributed traces.
