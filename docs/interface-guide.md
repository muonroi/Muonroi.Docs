# Sử dụng các interface cơ bản

## 1. IMapFrom

`IMapFrom<T>` là interface dùng cho bộ mapper tích hợp sẵn nhằm tự động đăng ký các mapping giữa DTO và entity.

1. Khai báo class implement `IMapFrom<T>`:
   ```csharp
   public class UserDto : IMapFrom<MUser>
   {
       public string Username { get; set; } = string.Empty;
   }
   ```
2. Gọi `services.ConfigureMapper()` trong `Program.cs` để quá triình scan và đăng ký mapping hoàn tất.

Sau khi cấu hình, mapper sẽ tự động chuyển đổi qua lại giữa `MUser` và `UserDto` khi gọi `IMapper`.

## 2. IMDateTimeService

`IMDateTimeService` cung cấp các phương thức lấy thời gian thống nhất trong ứng dụng:

```csharp
public interface IMDateTimeService
{
    DateTime Now();
    DateTime UtcNow();
    DateTime Today();
    DateTime UtcToday();
}
```

Dịch vụ được đăng ký tự động khi gọi `services.AddInfrastructure<Program>(configuration)`.

Bạn chỉ cần inject và sử dụng:
```csharp
public class SampleHandler(IMDateTimeService dateTimeService)
{
    public Task Handle()
    {
        DateTime now = dateTimeService.UtcNow();
        // ...
    }
}
```

## 3. IMJsonSerializeService

`IMJsonSerializeService` được sử dụng để chuyển đổi object sang chuổi JSON và ngược lại. Mặc định thư viện sử dụng Newtonsoft.Json.

```csharp
string json = serializeService.Serialize(obj);
MyType? value = serializeService.Deserialize<MyType>(json);
```

Dịch vụ đã được đăng ký trong `AddInfrastructure`, vì vậy chỉ cần inject `IMJsonSerializeService` và sử dụng.

## 4. IPermissions

`IPermissions` là interface nhỏ gồm phương thức `ToLong()` giúp chuyển quyền về dạng số để lưu trữ hoặc so sánh nhanh.
Khi định nghĩa enum quyền, bạn có thể implement interface này:

```csharp
public enum MyPermission : long, IPermissions
{
    ViewUser   = 1 << 0,
    CreateUser = 1 << 1,
    UpdateUser = 1 << 2,
    DeleteUser = 1 << 3
}

long IPermissions.ToLong() => (long)this;
```

Giá trị số này có thể được sử dụng kết hợp `AddPermissionFilter<MyPermission>()` để kiểm tra quyền truy cập các API.


