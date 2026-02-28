# Quản lý secret

Các khóa ký JWT và chuỗi kết nối nên được lưu trữ trong secret store (ví dụ Azure Key Vault, HashiCorp Vault).

Thư viện cung cấp `ISecretProvider` để trừu tượng hóa nguồn secret. Mặc định `ConfigurationSecretProvider` lấy giá trị từ cấu hình, nhưng có thể thay thế bằng provider truy cập Key Vault.

Ví dụ đăng ký:

```csharp
services.AddSingleton<ISecretProvider, ConfigurationSecretProvider>();
```

Các extension như `ResolveBearerToken` và `MConnectionStringProvider` sẽ sử dụng `ISecretProvider` để lấy secret theo yêu cầu ASVS V2/V3.
