# Hướng dẫn đăng nhập OAuth2/OIDC

Muonroi Building Block hỗ trợ tuỳ biến đăng nhập ngoài. Bạn có thể cấu hình OpenID Connect để sử dụng các nhà cung cấp như Google, Facebook, Azure AD hoặc IdentityServer. Sau khi xác thực, dịch vụ ngoài trả về thông tin người dùng và bạn có thể tạo JWT nội bộ để áp dụng hệ thống permission của thư viện.

## 1. Cấu hình `appsettings.json`

```json
"OidcConfig": {
  "Authority": "https://login.microsoftonline.com/<tenantId>/v2.0",
  "ClientId": "your-client-id",
  "ClientSecret": "your-client-secret",
  "Scopes": [ "openid", "profile", "email" ],
  "CallbackPath": "/signin-oidc"
}
```

## 2. Đăng ký dịch vụ

Trong `Program.cs` thêm cấu hình:

```csharp
builder.Services.AddOidcLogin(builder.Configuration);
```

Extension `AddOidcLogin` thuộc namespace `Muonroi.BuildingBlock.External.OAuth` và sử dụng `AddOpenIdConnect` để ủy quyền xác thực cho bên thứ ba.

## 3. Tạo token nội bộ

Sau khi người dùng đăng nhập thành công, dùng `MAuthenticateTokenHelper` để tạo access token của hệ thống và gán quyền cần thiết. Token này sẽ được kiểm tra bởi middleware như tài liệu Permission đã mô tả.

## 4. Ví dụ luồng đăng nhập

Ví dụ dưới đây minh họa toàn bộ quá trình đăng nhập OIDC và tạo JWT nội bộ:

```csharp
// Đăng nhập: chuyển hướng tới nhà cung cấp
app.MapGet("/login", (PkceClient client, HttpContext ctx) =>
{
    AuthorizationRequest auth = client.CreateAuthorizationRequest();
    ctx.Response.Cookies.Append("pkce_code_verifier", auth.CodeVerifier);
    return Results.Redirect(auth.Url);
});

// Callback: đổi mã lấy thông tin và phát hành token nội bộ
app.MapGet("/callback", async (string code, HttpContext ctx,
    PkceClient client, IHttpClientFactory factory,
    IMAuthenticateTokenHelper tokenHelper) =>
{
    string verifier = ctx.Request.Cookies["pkce_code_verifier"] ?? string.Empty;
    HttpClient http = factory.CreateClient();
    TokenResponse token = await client.RedeemCodeForTokenAsync(code, verifier, http);

    // Tạo JWT nội bộ sau khi nhận thông tin người dùng bên ngoài
    var user = new MUser { Id = Guid.NewGuid(), UserName = "external" };
    string accessToken = tokenHelper.CreateAccessToken(user);

    return Results.Ok(new { accessToken });
});
```

Luồng trên gồm ba bước:

1. Người dùng truy cập `/login` và được chuyển sang trang đăng nhập của bên thứ ba.
2. Nhà cung cấp gọi lại `/callback` với `code`; dịch vụ đổi mã lấy thông tin người dùng.
3. Hệ thống phát hành JWT nội bộ bằng `MAuthenticateTokenHelper` và trả về cho client.
