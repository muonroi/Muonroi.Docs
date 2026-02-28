# Bắt đầu sử dụng

Tài liệu này hướng dẫn cách cài đặt gói `Muonroi.BuildingBlock` và thiết lập dự án mới.

## Cài đặt gói NuGet

```bash
dotnet add package Muonroi.BuildingBlock
```

Đảm bảo dự án của bạn đang sử dụng .NET 8 trở lên.

## Cấu hình `Program.cs`

```csharp
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
Assembly assembly = Assembly.GetExecutingAssembly();
ConfigurationManager configuration = builder.Configuration;

builder.AddAppConfiguration();
builder.AddAutofacConfiguration();
builder.Host.UseSerilog((context, services, logger) =>
{
    MSerilogAction.Configure(context, services, logger, false);
});

IServiceCollection services = builder.Services;
services.AddApplication(assembly);
services.AddInfrastructure<Program>(configuration);
services.SwaggerConfig(builder.Environment.ApplicationName);

WebApplication app = builder.Build();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.ConfigureEndpoints();

await app.RunAsync();
```

## Cấu hình `appsettings.json`

Tạo file `appsettings.json` với các phần cấu hình cơ bản như `DatabaseConfigs`, `TokenConfigs` và `Serilog`. Tham khảo thêm trong README để biết chi tiết từng mục.

# Bắt đầu sử dụng

Tài liệu này hướng dẫn cài đặt gói `Muonroi.BuildingBlock` và thiết lập một dự án mới.

## Cài đặt gói NuGet

```bash
dotnet add package Muonroi.BuildingBlock
```

Đảm bảo dự án của bạn đang sử dụng .NET 8 trở lên (khuyến nghị .NET 9).

## Cấu hình `Program.cs`

Ví dụ cấu hình tối thiểu để khởi chạy API:

```csharp
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
Assembly assembly = Assembly.GetExecutingAssembly();
ConfigurationManager configuration = builder.Configuration;

builder.AddAppConfiguration();
builder.AddAutofacConfiguration();
builder.Host.UseSerilog((context, services, logger) =>
{
    MSerilogAction.Configure(context, services, logger, false);
});

IServiceCollection services = builder.Services;
services.AddApplication(assembly);
services.AddInfrastructure<Program>(configuration);
services.SwaggerConfig(builder.Environment.ApplicationName);

WebApplication app = builder.Build();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.ConfigureEndpoints();

await app.RunAsync();
```

## Cấu hình `appsettings.json`

Tạo file `appsettings.json` với các phần cấu hình cơ bản như `DatabaseConfigs`, `TokenConfigs` và `Serilog`. Tham khảo thêm trong README để biết chi tiết từng mục.

Ví dụ rút gọn:

```json
{
  "DatabaseConfigs": {
    "DbType": "Sqlite",
    "ConnectionStrings": { "SqliteConnectionString": "Data Source=app.db" }
  },
  "TokenConfigs": {
    "Issuer": "https://example.com",
    "Audience": "https://example.com",
    "UseRsa": true,
    "ExpiryMinutes": 30
  },
  "Serilog": {
    "Using": ["Serilog.Sinks.Console"],
    "WriteTo": [ { "Name": "Console" } ]
  }
}
```

## Kế tiếp

- [Hướng dẫn phân quyền](../03-guides/identity-access/permission-guide.md): cấu hình RBAC và quyền chi tiết.
- [Permission Tree Guide](../03-guides/identity-access/permission-tree-guide.md): đồng bộ cây quyền cho ứng dụng client.
