# Hướng dẫn cấu hình SignalR

Tài liệu này giới thiệu cách đăng ký SignalR trong dự án sử dụng Muonroi Building Block.

## Đăng ký dịch vụ

Trong `Program.cs`, gọi:

```csharp
services.AddSignalRWithTenant(configuration);
```

Extension này tự động thêm `services.AddSignalR()` và đăng ký `TenantHubFilter` khi cấu hình `MultiTenantConfigs:Enabled` bằng `true`.

## Multi-tenant

Khi `MultiTenantConfigs:Enabled` là `true`, `TenantHubFilter` sẽ lấy `tenantId` từ claim, header hoặc tên miền (thông qua `ITenantIdResolver`). Giá trị này được gán vào `TenantContext.CurrentTenantId` cho mỗi lời gọi tới Hub. Nếu `tenantId` không tồn tại, kết nối sẽ bị từ chối.

Nếu `Enabled` là `false`, filter sẽ không được đăng ký và SignalR hoạt động như bình thường.

## Xác thực

Các hub sử dụng cấu hình JWT mặc định của ứng dụng. Token có thể gửi qua tham số truy vấn `access_token` khi khởi tạo kết nối. Extension sẽ tự động đọc giá trị này và xác thực kết nối.

## Sử dụng trong Hub

Trong lớp Hub, bạn có thể truy cập `TenantContext.CurrentTenantId` để biết tenant hiện tại:

```csharp
public class ChatHub : Hub
{
    public Task SendMessage(string message)
    {
        string? tenant = TenantContext.CurrentTenantId;
        // Thực hiện xử lý theo tenant nếu cần
        return Clients.All.SendAsync("Receive", message);
    }
}
```
