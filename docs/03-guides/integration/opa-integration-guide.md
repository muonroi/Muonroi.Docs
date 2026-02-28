# OPA Integration Guide

Open Policy Agent (OPA) cung cấp cơ chế đánh giá chính sách linh hoạt. Thư viện sử dụng dịch vụ OPA để kiểm tra quyền truy cập ngoài JWT mặc định.

## 1. Khởi chạy OPA server

```bash
opa run --server --watch policy.rego
```

Tập tin `policy.rego` chứa các quy tắc cho API của bạn.

## 2. Cấu hình dịch vụ OPA

```csharp
services.AddHttpClient<OpaAuthorizationService>(c =>
{
    c.BaseAddress = new Uri("http://localhost:8181/");
});
```

`OpaAuthorizationService` gửi yêu cầu tới OPA để đánh giá chính sách.

## 3. Áp dụng trong endpoint

```csharp
app.MapGet("/data", [Authorize] async (HttpContext ctx, OpaAuthorizationService opa) =>
{
    bool allowed = await opa.AuthorizeAsync(new { path = "/data", subject = ctx.User.Identity?.Name });
    return allowed ? Results.Ok("Sensitive data") : Results.Forbid();
});
```

## 4. Ví dụ chính sách

```rego
package httpapi.authz

default allow = false

allow {
  input.path == "/data"
  input.subject == "demo"
}
```

Tham khảo dự án mẫu `Samples/AuthAuthzBff` để xem cấu hình đầy đủ kết hợp OIDC, BFF và OPA.
