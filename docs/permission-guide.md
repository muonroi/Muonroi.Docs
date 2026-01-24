# Hệ thống phân quyền và Permission

Thư viện cung cấp sẵn cơ chế phân quyền dựa trên người dùng, vai trò và các quyền cụ thể. Mỗi quyền được khai báo dưới dạng `enum` và được ánh xạ vào bảng `MPermissions` để lưu trữ.

## 1. Khai báo quyền

Khi cài đặt thư viện, bạn định nghĩa một `enum` chứa các quyền của hệ thống. Nên đánh dấu enum bằng `[Flags]` để thể hiện cơ chế bitmask và tránh giá trị trùng lặp:

```csharp
[Flags]
public enum MyPermission
{
    ViewUser   = 1 << 0,
    CreateUser = 1 << 1,
    UpdateUser = 1 << 2,
    DeleteUser = 1 << 3
}
```

> **Lưu ý về giới hạn**
>
> Phương thức `CalculatePermissionsBitmask` sử dụng kiểu `long` để gom danh sách
> quyền thành một giá trị số. Điều này đồng nghĩa hệ thống chỉ hỗ trợ tối đa
> **64** quyền riêng biệt. Nếu dự án cần nhiều quyền hơn, bạn có thể cân nhắc:
> 
> - Thay đổi chiến lược lưu trữ, ví dụ ghi chuỗi quyền vào claim JWT
>   (`"Permissions": "ViewUser,CreateUser"`) và so sánh chuỗi khi xác thực.
> - Hoặc tách quyền ra nhiều claim khác nhau (`Permissions1`, `Permissions2`, …).
> 
> Việc so sánh chuỗi có thể ảnh hưởng hiệu năng một chút nhưng cho phép số lượng
> quyền không giới hạn. Hãy cân nhắc cập nhật tài liệu của dự án nếu vượt quá giới hạn này.

Extension `AddPermissionFilter<MyPermission>()` sẽ đăng ký middleware kiểm tra quyền cho từng request. Hàm `MPermissionExtension.CalculatePermissionsBitmask` hỗ trợ gom danh sách quyền thành một giá trị số để so sánh nhanh.

Bạn cũng có thể gán quyền động cho từng endpoint bằng attribute `AuthorizePermission`. Đăng ký filter bằng:

```csharp
services.AddDynamicPermission<MyDbContext>();
```

Sau đó trang trí controller hoặc action:

```csharp
[AuthorizePermission("User.View")]
public IActionResult GetUsers() { }
```

Danh sách quyền của người dùng được lưu trong cache với key `user_permissions:{userId}` (hết hạn 15 phút).

## 2. Cơ chế phân quyền

Một người dùng có thể thuộc nhiều vai trò. Quyền thực tế của người dùng được tổng hợp từ các quyền gán trực tiếp và các quyền thuộc các vai trò của họ. Thư viện cung cấp sẵn `MAuthControllerBase` và `AuthService<TPermission, TDbContext>` để thực hiện các API quản lý người dùng, vai trò và gán quyền.

Quá trình xác thực diễn ra như sau:

1. `JwtMiddleware` giải mã token và gán thông tin người dùng vào `HttpContext`. Hãy đăng ký middleware này trong `Program.cs` để xử lý JWT trước `MAuthenMiddleware`.
2. `MAuthenMiddleware` kiểm tra `RefreshToken` hoặc `TokenValidityKey` bằng Redis cache trước khi truy vấn bảng `MRefreshTokens`.
3. Sau khi hợp lệ, thông tin `UserId` và danh sách quyền được lưu vào `MAuthenticateInfoContext` để các phần khác sử dụng.

## 3. Các bảng mặc định

Dưới đây là danh sách các bảng mặc định mà `MDbContext` khởi tạo cùng ý nghĩa của chúng:

| Bảng | Mục đích |
| --- | --- |
| **MUsers** | Lưu thông tin tài khoản người dùng. |
| **MRoles** | Danh sách vai trò. |
| **MPermissions** | Danh sách quyền (mỗi record tương ứng một giá trị trong enum) kèm metadata UI như `Type`, `UiKey`, `ParentUiKey`. |
| **MRolePermissions** | Liên kết giữa vai trò và quyền. |
| **MUserRoles** | Liên kết giữa người dùng và vai trò. |
| **MRefreshTokens** | Lưu refresh token và khóa hợp lệ của người dùng. |
| **MUserTokens** | Token sử dụng cho đăng nhập ngoài (OAuth, v.v.; tùy chọn). |
| **MUserLoginAttempts** | Ghi lại lịch sử đăng nhập và số lần thất bại để khóa tài khoản khi cần (tùy chọn). |
| **MLanguages** | Danh sách ngôn ngữ hỗ trợ cho tính năng localization. |
| **MPermissionGroups** | Gom nhóm các quyền theo từng module. |
| **MPermissionAuditLogs** | Lưu lịch sử gán và thu hồi quyền (tùy chọn). |

Các bảng trên được ánh xạ thông qua `DbSet` trong `MDbContext` nên sẽ tự động tạo khi chạy `MigrateDatabase<TDbContext>()`.

## 4. Đồng bộ quyền với Frontend

Bạn có thể đồng bộ danh sách quyền giữa backend và frontend bằng cách gọi endpoint `permission-definitions` được định nghĩa trong `MAuthControllerBase`. Endpoint này yêu cầu xác thực và trả về cấu trúc nhóm quyền cùng các quyền tương ứng:

```json
[
  {
    "groupName": "System",
    "groupDisplayName": "System",
    "permissions": ["Auth_All"]
  }
]
```

Frontend nên gọi endpoint này khi khởi động để luôn cập nhật danh sách quyền mới nhất từ backend.

## Checklist

- Định nghĩa enum quyền với `[Flags]` và lưu ý giới hạn 64 bit; nếu vượt quá hãy dùng phương án lưu chuỗi.
- Quyền của người dùng được cache với key `user_permissions:{userId}` (hết hạn 15 phút). Xoá cache khi thay đổi vai trò hoặc quyền.
- Frontend đồng bộ quyền bằng endpoint `permission-definitions` để tránh lệch cấu hình.

