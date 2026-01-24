# Hướng dẫn cấu hình `appsettings.json`

Tài liệu này giải thích chi tiết các mục cấu hình trong `appsettings.json` của Muonroi Building Block và cách đăng ký chúng trong `Program.cs`.

## Ví dụ tổng quát
```json
{
  "DatabaseConfigs": {
    "DbType": "Sqlite",
    "ConnectionStrings": {
      "SqliteConnectionString": "<chuỗi kết nối đã mã hóa>"
    }
  },
  "CacheConfigs": { "CacheType": "MultiLevel" },
  "RedisConfigs": {
    "Enable": true,
    "Host": "localhost",
    "Port": "6379",
    "Password": "",
    "Expire": 30,
    "KeyPrefix": "app"
  },
  "TokenConfigs": {
    "Issuer": "https://example.com",
    "Audience": "https://example.com",
    "SymmetricSecretKey": "your-secret-key-at-least-32-chars-replace-me",
    "UseRsa": true,
    "PublicKeyPath": "keys/public.pem",
    "PrivateKeyPath": "keys/private.pem",
    "ExpiryMinutes": 30
  },
  "MultiTenantConfigs": { "Enabled": true },
  "ResourceSetting": { "ResourceName": "Resources.ErrorMessages", "lang": "vi-VN" },
  "Serilog": {
    "Using": [ "Serilog.Sinks.Console", "Serilog.Sinks.File" ],
    "WriteTo": [
      { "Name": "Console" },
      { 
        "Name": "File", 
        "Args": { 
          "path": "logs/app-.log", 
          "rollingInterval": "Day" 
        } 
      }
    ]
  },
  "MessageBusConfigs": {
    "BusType": "Kafka",
    "Kafka": { "Host": "localhost:9092", "Topic": "sample", "GroupId": "group" }
  }
}
```

## 1. `DatabaseConfigs`
- `DbType`: Loại cơ sở dữ liệu (Sqlite, SqlServer, PostgreSql, ...).
- `ConnectionStrings`: Tập hợp chuỗi kết nối có thể mã hoá.

**Program.cs**
```csharp
services.AddDbContextConfigure<MyDbContext, MyPermission>(configuration);
```

## 2. `CacheConfigs` và `RedisConfigs`
Chỉ định chiến lược cache. Khi dùng Redis hãy cấu hình `RedisConfigs`.

**Program.cs**
```csharp
services.AddMultiLevelCaching(configuration);
```

## 3. `TokenConfigs`
Cấu hình phát hành và xác thực JWT.

**Program.cs**
```csharp
services.AddValidateBearerToken<MyDbContext, MTokenInfo, MyPermission>(configuration);
```

## 4. `MultiTenantConfigs`
Bật tính năng đa tenant.

**Program.cs**
```csharp
services.AddTenantContext(configuration);
app.UseMiddleware<TenantContextMiddleware>();
```

## 5. `ResourceSetting`
Khai báo nguồn tài nguyên ngôn ngữ.

**Program.cs**
```csharp
app.AddLocalization(Assembly.GetExecutingAssembly());
```

## 6. `Serilog`
Cấu hình ghi log với Serilog.

**Program.cs**
```csharp
builder.Host.UseSerilog((ctx, sv, cfg) => MSerilogAction.Configure(ctx, sv, cfg));
```

## 7. `MessageBusConfigs`
Khai báo broker Kafka hoặc RabbitMQ.

**Program.cs**
```csharp
services.AddMessageBus(configuration, Assembly.GetExecutingAssembly());
```

## Bối cảnh (Context)

### TenantContext
`TenantContext` lưu `TenantId` hiện tại cho luồng xử lý. Middleware `TenantContextMiddleware` tự động đọc `tenantId` từ claim, header hoặc subdomain và gán vào `TenantContext.CurrentTenantId` để `DbContext` lọc dữ liệu.

### MAuthenticateInfoContext (UserContext)
`MAuthenticateInfoContext` chứa thông tin người dùng, token và các header liên quan tới request hiện tại. Bối cảnh này được khởi tạo trong `AuthContextModule` và có thể truy cập thông qua DI. Các middleware như `JwtMiddleware` và `MAuthenMiddleware` sẽ gán giá trị cho context này.

Nếu cần lấy thông tin người dùng từ service khác, bạn có thể cài đặt `IAuthContextFactory` tùy chỉnh:

```csharp
builder.Services.AddAuthContextFactory<MyAuthFactory>();
```
Ví dụ triển khai `MyAuthFactory` gọi sang service khác để lấy thông tin người dùng
và nạp `tenantId` vào `TenantContext`:

```csharp
public class MyAuthFactory(
    IHttpContextAccessor accessor,
    IUserProfileService userService) : IAuthContextFactory
{
    public MAuthenticateInfoContext Create()
    {
        HttpContext? ctx = accessor.HttpContext;
        if (ctx is null) return new(false);

        string? token = ctx.Request.Headers.Authorization;
        UserProfile? info = userService.GetProfileByTokenAsync(token).Result;
        if (info is null) return new(false);

        TenantContext.CurrentTenantId = info.TenantId;
        return new MAuthenticateInfoContext(true)
        {
            CurrentUserGuid = info.Id,
            CurrentUsername = info.Username,
            AccessToken = token
        };
    }
}
```

### IAmqpContext
Khi xử lý message từ Kafka/RabbitMQ, `IAmqpContext` cung cấp phương thức lấy header (ví dụ `CorrelationId`) để khởi tạo `MAuthenticateInfoContext` cho consumer. Headers được xóa tự động sau khi consumer hoàn thành để tránh rò rỉ dữ liệu giữa các message.

Nếu muốn tuỳ biến việc kiểm tra refresh token, hãy implement `IRefreshTokenValidator` và đăng ký service của bạn:

```csharp
builder.Services.AddScoped<IRefreshTokenValidator, MyRefreshTokenValidator>();
```
Ví dụ `MyRefreshTokenValidator` gọi API xác thực và khởi tạo `MAuthenticateInfoContext`:

```csharp
public class MyRefreshTokenValidator(IAuthApi authApi) : IRefreshTokenValidator
{
    public async Task<MAuthenticateInfoContext?> ValidateAsync(HttpContext context)
    {
        string? refresh = context.Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refresh))
        {
            return null;
        }

        ValidateTokenResponse? result = await authApi.VerifyAsync(refresh);
        if (result is null)
        {
            return null;
        }

        TenantContext.CurrentTenantId = result.TenantId;
        MAuthenticateInfoContext info = new(true)
        {
            CurrentUserGuid = result.UserId,
            CurrentUsername = result.Username,
            TokenValidityKey = result.TokenValidityKey
        };
        context.Items[typeof(MAuthenticateInfoContext).FullName!] = info;
        return info;
    }
}
```

## Sử dụng bối cảnh ở service khác

Khi gọi đến các HTTP API hoặc gRPC service bên ngoài, hãy kế thừa các lớp cơ sở
để thư viện tự gắn `CorrelationId`, `TenantId` và thông tin người dùng vào
request.

### HTTP/Refit service

```csharp
public class ExternalUserService(MAuthenticateInfoContext auth, IConfiguration cfg)
    : BaseApiService(auth)
{
    private readonly IUserApi _api =
        CreateClient<IUserApi>(cfg["ExternalApis:UserService"]!);

    public Task<UserDto> GetUserAsync(string id) => _api.GetUserAsync(id);
}
```

Đăng ký service:

```csharp
services.AddScoped<ExternalUserService>();
```

### gRPC service

```csharp
public class SampleGrpcService(MAuthenticateInfoContext auth, SampleGrpc.SampleGrpcClient client)
    : BaseGrpcService(auth)
{
    private readonly SampleGrpc.SampleGrpcClient _client = client;

    public Task<SampleReply> GetDataAsync(int id)
    {
        return CallGrpcServiceAsync(meta =>
            _client.GetDataAsync(new SampleRequest { Id = id }, meta));
    }
}
```

Đăng ký client và service trong `Program.cs`:

```csharp
services.AddGrpcClients(configuration, new Dictionary<string, Type>
{
    { "SampleService", typeof(SampleGrpc.SampleGrpcClient) }
});
services.AddScoped<SampleGrpcService>();
```

### Message bus

`TenantContextConsumeFilter` sẽ lấy `tenantId` từ header và gán vào
`TenantContext.CurrentTenantId` cho consumer. Khi publish message, dùng
`PublishWithContext` để gắn `tenantId` và thông tin người dùng:

```csharp
await publishEndpoint.PublishWithContext(message, authContext, TenantContext.CurrentTenantId);
```

### Đăng ký trong Program

Kết hợp mọi thứ trong `Program.cs`:

```csharp
builder.Services.AddTenantContext(builder.Configuration);
builder.Services.AddScoped<ExternalUserService>();
builder.Services.AddGrpcClients(builder.Configuration, new Dictionary<string, Type>
{
    { "SampleService", typeof(SampleGrpc.SampleGrpcClient) }
});

var app = builder.Build();
app.UseMiddleware<TenantContextMiddleware>();
```
