# Hướng dẫn cấu hình Dapper

Thư viện hỗ trợ truy vấn cơ sở dữ liệu bằng Dapper thông qua gói `Dapper.Extensions.NetCore`.
Dưới đây là cách đăng ký và sử dụng.

## Đăng ký dịch vụ

```csharp
services.AddDapper();
services.AddSingleton<IConnectionStringProvider, MConnectionStringProvider>();
MSqlMapperTypeExtensions.RegisterDapperHandlers();
```

`MConnectionStringProvider` tự đọc chuỗi kết nối từ `appsettings.json` (có thể mã hóa) và
`RegisterDapperHandlers` thêm một số `TypeHandler` cần thiết như cắt chuỗi thừa hoặc xử lý `Timestamp`.

Nếu dùng Redis cho bộ nhớ đệm, hãy bật caching cho Dapper:

```csharp
services.AddDapperCaching(configuration, redisConfigs);
```

## Truy vấn phân trang

Sử dụng `MDapperCommand` để khai báo câu lệnh SQL và gọi các hàm mở rộng trong `MDapperExtensions`.
Ví dụ:

```csharp
public class UserQueries(IDapper dapper)
{
    public Task<PageResult<UserDto>> GetUsersAsync(int page, int size)
    {
        MDapperCommand cmd = new() { CommandText = "SELECT * FROM Users ORDER BY Id" };
        string countSql = "SELECT COUNT(1) FROM Users";
        return dapper.QueryPageAsync<UserDto>(cmd, countSql, page, size);
    }
}
```

`QueryPageAsync` trả về `PageResult<T>` gồm tổng số bản ghi, trang hiện tại và danh sách kết quả.
