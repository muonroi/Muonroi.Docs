# OAuth2/OIDC với Authorization Code + PKCE

Từ phiên bản này, Muonroi Building Block chuẩn hoá việc đăng nhập bên ngoài theo [OAuth 2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-11) và [OAuth.net](https://oauth.net/2/). Ứng dụng SPA/native chỉ sử dụng Authorization Code Flow kết hợp PKCE, loại bỏ hoàn toàn implicit flow.

## Luồng chuẩn
1. Ứng dụng tạo mã `code_verifier` và sinh `code_challenge` theo SHA256.
2. Gửi người dùng đến endpoint `/authorize` với các tham số:
   - `response_type=code`
   - `code_challenge` và `code_challenge_method=S256`
   - `redirect_uri` khớp tuyệt đối với cấu hình
   - `state` và `nonce` ngẫu nhiên để chống CSRF và replay
3. Sau khi nhận `code`, ứng dụng gọi `/token` kèm `code_verifier` để đổi lấy `access_token`, `id_token` và `refresh_token`.
4. Khi `refresh_token` được sử dụng, luôn cập nhật token mới trả về để đảm bảo **rotate refresh token**.

## Ví dụ cấu hình
```csharp
var options = new OidcOptions
{
    Authority = "https://login.example.com",
    ClientId = "spa-client",
    RedirectUri = "myapp://callback",
    Scopes = new[] { "openid", "profile" }
};
var client = new PkceClient(options);
```

`PkceClient` sẽ sinh URL ủy quyền với đầy đủ `nonce`, `state` và PKCE. Hàm `RedeemCodeForTokenAsync` kiểm tra `redirect_uri` phải khớp tuyệt đối với cấu hình để giảm nguy cơ tấn công. Hàm `RefreshTokenAsync` đọc `refresh_token` mới trong phản hồi để bạn lưu lại và thay thế token cũ.
