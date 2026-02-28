# Hướng dẫn Background Jobs

Thư viện hỗ trợ Hangfire hoặc Quartz thông qua cấu hình `BackgroundJobConfigs`.

```json
"BackgroundJobConfigs": {
  "JobType": "Hangfire",
  "ConnectionString": "Server=mydb;Database=jobs;User Id=sa;Password=pass"
}
```

Đăng ký dịch vụ:

```csharp
services.AddHangfire(x => x.UseSqlServerStorage(configuration["BackgroundJobConfigs:ConnectionString"]));
app.UseHangfireDashboard();
```

## Tenant-aware jobs

Để tự động gán `TenantContext.CurrentTenantId` cho mỗi job Hangfire, kế thừa lớp `TenantAwareJobBase` và gọi phương thức `RunAsync` trong job của bạn. Phương thức này nhận `tenantId` từ tham số job và thiết lập ngữ cảnh trước khi thực thi.

Từ phiên bản mới, `RunAsync` cho phép truyền thêm `userGuid` và `username` để đặt `UserContext`. Điều này giúp job chạy dưới đúng người dùng của tenant.

```csharp
public class SampleJob : TenantAwareJobBase
{
    protected override Task ExecuteAsync(CancellationToken cancellationToken)
    {
        // Logic dưới tenant hiện tại
        return Task.CompletedTask;
    }

    public Task Handle(string tenantId, string userGuid, string username)
        => RunAsync(tenantId, userGuid, username);
}
```
