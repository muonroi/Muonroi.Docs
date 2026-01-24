# Hướng dẫn Kiến trúc Backend

## 1. Truy xuất Entity giữa các Repository

Trong một số trường hợp chúng ta cần truy vấn dữ liệu của Entity nằm ngoài phạm vi Repository hiện tại. Ví dụ `AuthenticateRepository` sử dụng trực tiếp `MDbContext` để truy vấn `MUser` và các bảng liên quan. Việc này chỉ nên thực hiện khi logic thực sự thuộc về Repository đó hoặc khi xử lý transaction phức tạp.

Khi cần truy vấn sang entity khác, hãy inject `MDbContext` hoặc truy cập qua thuộc tính `UnitOfWork` của `MRepository<T>`. Đảm bảo mỗi Repository chỉ chịu trách nhiệm cho nghiệp vụ của chính nó để tránh vi phạm DDD.

Ví dụ trong `AuthService` truy vấn nhiều bảng để lấy danh sách người dùng theo role:

```csharp
List<MUser> users = await (from role in _dbContext.Set<MRole>().AsNoTracking()
                           join userRole in _dbContext.Set<MUserRole>().AsNoTracking() on role.EntityId equals userRole.RoleId
                           join user in _dbContext.Set<MUser>().AsNoTracking() on userRole.UserId equals user.EntityId
                           where role.EntityId == roleId && !user.IsDeleted && !role.IsDeleted && !userRole.IsDeleted
                           select user).ToListAsync(cancellationToken);
```

Lúc này `AuthService` trực tiếp lấy `DbSet` của các entity thông qua `MDbContext` để thực hiện join.

Nếu cần mapping sang DTO có thể dùng mapper tích hợp sẵn hoặc thực hiện thủ công:

```csharp
var dto = _mapper.Map<UserDto>(user);
```

Việc lấy dữ liệu chéo repository nên hạn chế và được bao bọc trong `UnitOfWork` khi cần giao dịch.

## 2. Extension Methods

Thư mục `External/Extensions` chứa nhiều phương thức mở rộng hữu ích:

- `MStringExtention.NormalizeString()` chuẩn hóa chuỗi bỏ dấu và khoảng trắng.
- `MStringExtention.ToBase64String()` và `FromBase64String()` mã hóa/giải mã Base64.
- `MLockExtension.Locking()` hỗ trợ khóa đối tượng khi thực thi đoạn code.
- `DbContextExtensions.BulkInsertAsync()` thêm nhiều bản ghi trong một transaction.

Ví dụ sử dụng:

```csharp
string normalized = "Tiếng Việt".NormalizeString();
string encoded = "hello".ToBase64String();
await dbContext.BulkInsertAsync(listEntity);
```

Chỉ nên dùng các extension này khi phù hợp với ngữ cảnh để giữ cho code rõ ràng.

## 3. BaseController

`MControllerBase` cung cấp sẵn các dịch vụ chung cho tất cả controller:

```csharp
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public abstract class MControllerBase(IMediator mediator, ILogger logger, IMapper mapper) : ControllerBase
```

Các thuộc tính sẵn có gồm `Mediator`, `Logger` và `Mapper` để gọi Handler hoặc log. Khi kế thừa, controller chỉ cần gọi `Mediator.Send()` tới handler tương ứng.

Có thể áp dụng `MControllerBaseConvention` để tự động cấu hình `ProducesResponseType` cho các action trả về `MResponse<T>`.

## 4. BaseHandler / IRequestHandler

Các handler xử lý nghiệp vụ thường kế thừa `BaseCommandHandler` hoặc `MBaseHandler`.

```csharp
public abstract class BaseCommandHandler(
    IMapper mapper,
    MAuthenticateInfoContext tokenInfo,
    IAuthenticateRepository authenticateRepository,
    ILogger logger,
    IMediator mediator,
    MPaginationConfig paginationConfig)
```

Handler có sẵn các phương thức `SendAsync`, `PublishAsync` để tương tác với MediatR, cùng các hàm log và `Mapper.Map` để chuyển đổi DTO. Quy trình xử lý điển hình: validate → thực thi nghiệp vụ → trả về `MResponse`.

Nên chia nhỏ handler khi logic quá phức tạp hoặc phục vụ các use case riêng biệt.

## 5. Middleware xác thực và phân quyền

Middleware `JwtMiddleware` và `MAuthenMiddleware` đảm nhận việc giải mã token và kiểm tra quyền truy cập. Dòng xử lý cơ bản:

1. HTTP request đi vào `JwtMiddleware`.
2. Middleware đọc header Authorization, giải mã JWT và gán `Claims` vào `HttpContext.User`.
3. `MAuthenMiddleware` tiếp tục kiểm tra `RefreshToken` hoặc `TokenValidityKey` thông qua Redis cache trước khi truy vấn `MDbContext`.
4. Các thông tin `UserId`, `TokenValidityKey`, `Permission` được lưu vào header và `HttpContext` để sử dụng về sau.

Ví dụ đoạn mã trong `JwtMiddleware`:

```csharp
MAuthenticateInfoContext verifyToken = await _callbackVerifyToken(serviceProvider, context);
if (!verifyToken.IsAuthenticated)
{
    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
    return;
}
context.User = new(new ClaimsIdentity([...], JwtBearerDefaults.AuthenticationScheme));
```

### Cấu hình `JwtMiddleware`

Thêm middleware vào pipeline trước `MAuthenMiddleware`:

```csharp
app.UseMiddleware<JwtMiddleware>();
app.UseMiddleware<MAuthenMiddleware<MyDbContext, MyPermission>>();
```

`JwtMiddleware` phụ hợp cho các API sử dụng JWT. Middleware đọc header `Authorization`, giải mã token và gán thông tin người dùng vào `HttpContext.User`. Sau đó `MAuthenMiddleware` kiểm tra khóa hợp lệ bằng Redis cache trước khi truy vấn cơ sở dữ liệu. Nếu chỉ cần xác thực cấp token và không kiểm tra `RefreshToken` có thể bỏ qua `MAuthenMiddleware`.

Khi xây dựng controller, có thể truy cập `HttpContext.User` hoặc `MAuthenticateInfoContext` để lấy thông tin người dùng và kiểm tra quyền thông qua `IAuthorizationService` nếu cần.

### Xác thực cookie với `MCookieAuthMiddleware`

`MCookieAuthMiddleware` hỗ trợ mô hình BFF: nếu `TokenConfigs.EnableCookieAuth` bật và request không có header `Authorization`, middleware sẽ đọc cookie chứa access token, giải mã và thêm vào header. Điều này giúp trình duyệt gửi token an toàn mà vẫn sử dụng cơ chế header chuẩn.

```csharp
app.UseMiddleware<MCookieAuthMiddleware>();
```

Trong `appsettings.json` khai báo:

```json
"TokenConfigs": {
  "EnableCookieAuth": true,
  "CookieName": "AuthToken",
  "CookieSameSite": "Lax"
}
```

### Middleware xử lý lỗi toàn cục

`MExceptionMiddleware` ghi log và trả về JSON chuẩn khi xảy ra lỗi không được xử lý. Nên đặt middleware này đầu pipeline để bắt mọi exception.

```csharp
app.UseMiddleware<MExceptionMiddleware>();
```

### Thiết lập nhanh với `UseDefaultMiddleware`

Thay vì đăng ký từng middleware, có thể dùng một dòng:

```csharp
app.UseDefaultMiddleware<MyDbContext, MyPermission>();
```

`UseDefaultMiddleware` sắp xếp theo thứ tự `MExceptionMiddleware` → `MCookieAuthMiddleware` → `MAuthenMiddleware`. Bạn vẫn cần thêm `JwtMiddleware` và `TenantContextMiddleware` thủ công nếu dự án sử dụng JWT hoặc đa tenant.

## 6. Auto-CRUD API (Zero-Code)

Thư viện hỗ trợ tự động tạo các API CRUD cơ bản cho các Entity kế thừa từ `MEntity`.

1.  Tạo Entity kế thừa `MEntity`:
    ```csharp
    public class Product : MEntity
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
    ```
2.  Khi ứng dụng khởi chạy, `GenericControllerFeatureProvider` sẽ tự động quét và đăng ký controller:
    -   `GET /api/v1/Product` (Phân trang)
    -   `GET /api/v1/Product/{id}`
    -   `POST /api/v1/Product`
    -   `PUT /api/v1/Product`
    -   `DELETE /api/v1/Product/{id}`

Controller này sử dụng `MDbContext` và hỗ trợ đầy đủ xác thực (`[Authorize]`). Tên route sẽ tự động bỏ hậu tố `Entity` nếu có (ví dụ `SampleEntity` -> `/api/v1/Sample`).
