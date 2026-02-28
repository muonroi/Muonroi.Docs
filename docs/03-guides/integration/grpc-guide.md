# Hướng dẫn cấu hình gRPC Handler

Tài liệu này mô tả cách cấu hình server và client gRPC khi sử dụng thư viện Muonroi Building Block, đồng thời hướng dẫn gọi RPC từ service khác.

## Đăng ký server và client

Trong `Program.cs`, thêm cấu hình sau:

```csharp
services.AddGrpcServer();
services.AddGrpcClients(configuration, new Dictionary<string, Type>
{
    { "SampleService", typeof(SampleGrpc.SampleGrpcClient) }
});
```

Phần `GrpcServicesConfig` trong `appsettings.json` khai báo địa chỉ các dịch vụ:

```json
"GrpcServicesConfig": {
  "Services": {
    "SampleService": {
      "Uri": "https://localhost:5001"
    }
  }
}
```

## Tạo lớp gọi gRPC

Kế thừa `BaseGrpcService` để tự động thêm `CorrelationId`, `ApiKey` và `TenantId` vào metadata. Ví dụ:

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

Khi cần lấy dữ liệu từ service khác, chỉ cần inject `SampleGrpcService` và gọi `GetDataAsync`.

## Triển khai mô hình Agg - Service

Phần này minh họa cách xây dựng service gRPC riêng và một dự án Aggregator (Agg) gọi tới service đó.

### Cấu hình ở service gRPC

Trong dự án dịch vụ, đăng ký server và map service:

```csharp
builder.Services.AddGrpcServer();

var app = builder.Build();
app.MapGrpcService<MyGrpcService>();
```

### Cấu hình ở dự án Aggregator

Agg chỉ cần cấu hình client để gọi tới gRPC service:

```csharp
services.AddGrpcClients(configuration, new Dictionary<string, Type>
{
    { "SampleService", typeof(SampleGrpc.SampleGrpcClient) }
});
```

Trong `appsettings.json` của Agg, khai báo địa chỉ dịch vụ:

```json
"GrpcServicesConfig": {
  "Services": {
    "SampleService": {
      "Uri": "https://localhost:5001"
    }
  }
}
```

### Gọi dữ liệu từ gRPC trong Agg

Tạo lớp proxy kế thừa `BaseGrpcService` như ví dụ trên và inject vào controller hoặc handler:

```csharp
public class AggregatorService(SampleGrpcService sample)
{
    public async Task<MyDto> GetAsync(int id)
    {
        SampleReply reply = await sample.GetDataAsync(id);
        return new MyDto { Message = reply.Message };
    }
}
```

Khi cần lấy dữ liệu, chỉ cần gọi `AggregatorService.GetAsync` và xử lý kết quả.

### Lấy client trực tiếp bằng `GrpcClientFactory`

Sau khi đăng ký bằng `AddGrpcClients`, bạn có thể lấy client ở bất kỳ nơi nào thông qua `GrpcClientFactory`.
Ví dụ lớp Agg có thể kế thừa `BaseGrpcService` để tự động đính kèm context khi gọi:

```csharp
public class AggregatorService(GrpcClientFactory factory, MAuthenticateInfoContext auth)
    : BaseGrpcService(auth)
{
    private readonly SampleGrpc.SampleGrpcClient _client =
        factory.CreateClient<SampleGrpc.SampleGrpcClient>("SampleService");

    public Task<MyDto> GetAsync(int id)
    {
        return CallGrpcServiceAsync(meta =>
            _client.GetDataAsync(new SampleRequest { Id = id }, meta));
    }
}
```
