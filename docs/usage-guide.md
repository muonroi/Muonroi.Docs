# Hướng dẫn cài đặt và sử dụng Muonroi Building Block

## 1. Cài đặt

1. Cài đặt .NET SDK 8.0 hoặc mới hơn.
2. Thêm thư viện vào dự án của bạn:
   ```bash
   dotnet add package Muonroi.BuildingBlock
   ```
3. Tạo các file cấu hình theo ví dụ bên dưới.

## 2. Cấu hình `Program.cs`

```csharp
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
Assembly assembly = Assembly.GetExecutingAssembly();
ConfigurationManager configuration = builder.Configuration;

builder.AddAppConfiguration();
builder.AddAutofacConfiguration();
builder.Host.UseSerilog((context, services, loggerConfiguration) =>
{
    MSerilogAction.Configure(context, services, loggerConfiguration, false);
});

IServiceCollection services = builder.Services;
services.AddApplication(assembly);
services.AddInfrastructure<Program>(configuration);
services.SwaggerConfig(builder.Environment.ApplicationName);
services.AddScopeServices(typeof(MyDbContext).Assembly);
services.AddValidateBearerToken<MyDbContext, MTokenInfo, MyPermission>(configuration);
services.AddDbContextConfigure<MyDbContext, MyPermission>(configuration);
services.AddCors(configuration);
services.AddPermissionFilter<MyPermission>();
services.AddDynamicPermission<MyDbContext>();
services.ConfigureMapper();
services.AddGrpcServer();
services.AddServiceDiscovery(configuration, builder.Environment);
services.AddMessageBus(configuration, Assembly.GetExecutingAssembly(), cfg =>
{
    cfg.AddSagaStateMachine<OrderStateMachine, OrderState>()
       .InMemoryRepository();
});

WebApplication app = builder.Build();
await app.UseServiceDiscoveryAsync(builder.Environment);
app.UseCors("MAllowDomains");
app.UseDefaultMiddleware<MyDbContext, MyPermission>();
app.AddLocalization(assembly);
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.ConfigureEndpoints();
app.MigrateDatabase<MyDbContext>();

await app.RunAsync();
```

`UseDefaultMiddleware` tự động đăng ký lần lượt `MExceptionMiddleware`, `MCookieAuthMiddleware` và `MAuthenMiddleware`. Bạn vẫn cần thêm `JwtMiddleware` (và `TenantContextMiddleware` nếu dùng đa tenant) trước khi gọi phương thức này nếu ứng dụng yêu cầu.

## 3. Cấu hình `appsettings.json`

```json
{
  "DatabaseConfigs": {
    "DbType": "Sqlite",
    "ConnectionStrings": {
      "SqliteConnectionString": "<encrypted connection string>"
    }
  },
  "CacheConfigs": {
    "CacheType": "MultiLevel" // Memory | Redis | MultiLevel
    // Choose caching strategy
  },
  "RedisConfigs": {
    "Enable": true,
    "Host": "localhost",
    "Port": "6379",
    "Password": "",
    "Expire": 30,
    "KeyPrefix": "app",
    "AllMethodsEnableCache": false
  },
  "TokenConfigs": {
    "Issuer": "https://example.com",
    "Audience": "https://example.com",
    "SigningKeys": "",
    "UseRsa": true,
    "ExpiryMinutes": 30,
    "EnableCookieAuth": true,
    "CookieName": "AuthToken",
    "CookieSameSite": "Lax"
  },
  "MultiTenantConfigs": {
    "Enabled": true
  },
  "ResourceSetting": {
    "ResourceName": "Resources.ErrorMessages",
    "lang": "vi-VN"
  },
  "GrpcServices": {
    "Services": {
      "SampleService": { "Uri": "https://localhost:5001" }
    }
  },
  "ConsulConfigs": {
    "ServiceName": "MyService",
    "ConsulAddress": "http://localhost:8500",
    "ServiceAddress": "http://localhost",
    "ServicePort": 5000
  },
  "MessageBusConfigs": {
    "BusType": "Kafka",
    "Kafka": {
      "Host": "localhost:9092",
      "Topic": "sample-topic",
      "GroupId": "sample-group"
    }
  },
  "Serilog": {
    "Using": [ "Serilog.Sinks.Console", "Elastic.Serilog.Sinks" ],
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft.AspNetCore": "Warning"
      }
    },
    "WriteTo": [ { "Name": "Console" } ]
  }
}
```

### Thiết lập `SecretKey`

| Thuộc tính | Mô tả |
|------------|-------|
| `SecretKey` | Khoá bí mật dùng để giải mã các giá trị cấu hình đã mã hoá. Nên là chuỗi 32 ký tự. |
| `EnableEncryption` | Bật/tắt cơ chế tự động giải mã khi đọc cấu hình. |

Tạo khoá mẫu bằng:

```bash
openssl rand -hex 32
```

Cấu hình `MultiTenantConfigs` cho phép bật hoặc tắt tính năng đa tenant bằng
thuộc tính `Enabled`.

## 4. MQuery và MRepository

`MQuery<T>` và `MRepository<T>` hỗ trợ thao tác dữ liệu với `MDbContext`. Bạn có thể kế thừa hoặc sử dụng trực tiếp để truy vấn và lưu trữ. Ví dụ:

```csharp
public class UserRepository(MDbContext context, MAuthenticateInfoContext auth) : MRepository<MUser>(context, auth)
{
}

public class UserQueries(MDbContext context, MAuthenticateInfoContext auth) : MQuery<MUser>(context, auth)
{
}
```

## 5. Phản hồi API

`MResponse<T>` là lớp bao gói kết quả cho các action. Nó kế thừa `MVoidMethodResult` nên sẵn có `Id`, `UtcTime`, `StatusCode` và danh sách `ErrorMessages`. Thuộc tính `Result` chứa dữ liệu trả về, còn `Error` lưu lỗi đơn lẻ nếu có.

```csharp
MResponse<UserDto> response = new();
if (user is null)
{
    response.SetError("USER_NOT_FOUND");
}
else
{
    response.Result = _mapper.Map<UserDto>(user);
}
return response;
```

### 5.1 Phân trang với `MPagedResult`

`MPagedResult<T>` cung cấp cấu trúc cho danh sách phân trang với các thuộc tính `CurrentPage`, `PageSize`, `RowCount` và `Items`.

```csharp
MPagedResult<UserDto> page = await _userQueries.GetPagedAsync<UserDto>(query, 1, 10);
return new MResponse<MPagedResult<UserDto>> { Result = page };
```

## 6. AuthControllerBase

`MAuthControllerBase` cung cấp sẵn các API cho việc quản lý người dùng, vai trò và phân quyền. Bạn chỉ cần kế thừa và truyền vào kiểu `TPermission` và `TDbContext` của riêng bạn.

## 7. Kafka

Cấu hình Kafka thông qua `MessageBusConfigs` và gọi `services.AddMessageBus(configuration, Assembly.GetExecutingAssembly(), cfg =>
{
    // Đăng ký Saga tại đây nếu cần
});` để đăng ký MassTransit.

```json
"MessageBusConfigs": {
  "BusType": "Kafka",
  "Kafka": {
    "Host": "localhost:9092",
    "Topic": "sample-topic",
    "GroupId": "sample-group"
  }
}
```

```csharp
services.AddMessageBus(configuration, Assembly.GetExecutingAssembly());
```

### Tenant context for consumers

`TenantContextConsumeFilter` được đăng ký sẵn để lấy `tenantId` từ header
`x-tenant-id` và gán vào `TenantContext.CurrentTenantId` cho mọi consumer.

Khi publish message, sử dụng `PublishWithContext` để tự động gắn `tenantId` và thông tin người dùng vào header:

```csharp
await publishEndpoint.PublishWithContext(message, authContext, TenantContext.CurrentTenantId);
```

## 8. Redis

Cấu hình `CacheConfigs` và `RedisConfigs` để sử dụng bộ nhớ đệm Redis hoặc cache đa tầng.

```json
"CacheConfigs": {
  "CacheType": "MultiLevel"
},
"RedisConfigs": {
  "Enable": true,
  "Host": "localhost",
  "Port": "6379",
  "Password": "",
  "Expire": 30,
  "KeyPrefix": "app"
}
```

```csharp
services.AddMultiLevelCaching(configuration);
```

## 9. Background Jobs với Hangfire

Thư viện cho phép bạn chỉ định loại background job trong `BackgroundJobConfigs`. Ví dụ sử dụng Hangfire:

```json
"BackgroundJobConfigs": {
  "JobType": "Hangfire",
  "ConnectionString": "Server=mydb;Database=jobs;User Id=sa;Password=your_password;"
}
```

```csharp
services.AddHangfire(x => x.UseSqlServerStorage(configuration["BackgroundJobConfigs:ConnectionString"]));
app.UseHangfireDashboard();
```

```csharp
BackgroundJob.Enqueue(() => Console.WriteLine("Hello from Hangfire"));
```

## 10. Ghi log với Serilog

Thư viện đã tích hợp sẵn `MSerilogAction` để cấu hình Serilog. Thêm các sink cần thiết trong `appsettings.json` và gọi `builder.Host.UseSerilog(...)` như ở trên.

## 11. Consul

Sử dụng `services.AddServiceDiscovery(configuration, builder.Environment);` và `app.UseServiceDiscoveryAsync(builder.Environment);` để đăng ký dịch vụ với Consul.

## 12. gRPC

Đăng ký server bằng `services.AddGrpcServer();` và thêm client qua `services.AddGrpcClients(configuration, new Dictionary<string, Type>{{"SampleService", typeof(SampleGrpc.SampleGrpcClient)}});` nếu cần.

## 13. Gọi API ngoài

Sử dụng `BaseApiService` để tạo HTTP client có sẵn policy retry và timeout.
Thư viện sẽ tự động thêm `CorrelationId` và `ApiKey` vào header từ
`MAuthenticateInfoContext` mỗi khi gọi API.

### 13.1 Khai báo cấu hình

Thêm địa chỉ các dịch vụ ngoài vào `appsettings.json`:

```json
"ExternalApis": {
  "UserService": "https://api.example.com"
}
```

### 13.2 Định nghĩa interface API bằng Refit

```csharp
public interface IUserApi
{
    [Get("/users/{id}")]
    Task<UserDto> GetUserAsync(string id);
}
```

### 13.3 Tạo service kế thừa `BaseApiService`

```csharp
public class ExternalUserService(MAuthenticateInfoContext auth, IConfiguration cfg)
    : BaseApiService(auth)
{
    private readonly IUserApi _api =
        CreateClient<IUserApi>(cfg["ExternalApis:UserService"]!);

    public Task<UserDto> GetUserAsync(string id) => _api.GetUserAsync(id);
}
```

Đăng ký service trong DI:

```csharp
services.AddScoped<ExternalUserService>();
```

Sau đó inject `ExternalUserService` vào controller hoặc handler để gọi dữ liệu:

```csharp
public class MyHandler(ExternalUserService external)
{
    public async Task<UserDto> HandleAsync(string id)
    {
        return await external.GetUserAsync(id);
    }
}
```

## 14. Bối cảnh xác thực

`MAuthenticateInfoContext` lưu trữ thông tin người dùng hiện tại, mã thông báo và các header tùy chỉnh. Bối cảnh này được khởi tạo tự động trong `AuthContextModule` và có thể truy cập qua DI.

`IAmqpContext` dùng cho các message consumer để lấy header từ hàng đợi khi sử dụng Kafka hoặc RabbitMQ. Các header sẽ được xóa tự động sau khi xử lý nhằm ngăn chặn việc lẫn dữ liệu giữa các tenant.

## 15. Theo dõi request bằng TransactionId và CorrelationId

`RequestLoggingFilter` tự động ghi log khi mỗi action bắt đầu và kết thúc. Filter
sử dụng `HttpContext.TraceIdentifier` để tạo **TransactionId** – giá trị duy
nhất cho từng HTTP request trong một service. Nhờ vậy bạn có thể ghép cặp log
"Incoming" và "Completed" của cùng request.

**CorrelationId** được lưu trong `MAuthenticateInfoContext` và đính kèm vào mọi
lời gọi gRPC, Kafka hay Hangfire. Giá trị này lấy từ header `x-correlation-id`
nếu có, hoặc sinh mới khi request bắt đầu. Tất cả log ở các service khác nhau sẽ
dùng chung CorrelationId để bạn lần theo toàn bộ luồng xử lý.

Một ví dụ luồng `create` đi qua các thành phần gRPC, Kafka và Hangfire có thể
ghi log như sau:

```text
[HTTP] Incoming POST /api/v1/users        TransactionId=xxx CorrelationId=abc
[gRPC] gRPC call UsersService.Create started CorrelationId=abc
[gRPC] gRPC call UsersService.Create completed CorrelationId=abc
[Kafka] Published UserCreated message      CorrelationId=abc
[Kafka] Consumed UserCreated message       CorrelationId=abc
[Job]   Executed SendWelcomeEmailJob       TenantId=... UserGuid=...
[HTTP] Completed POST /api/v1/users        TransactionId=xxx CorrelationId=abc
```

Trong đó **TransactionId** giúp xác định log ở phạm vi một service, còn
**CorrelationId** liên kết log giữa nhiều service và các job bất đồng bộ.

---
