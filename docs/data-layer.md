# Quản lý dữ liệu với MDbContext và Repository

Thư viện cung cấp sẵn các lớp **MRepository<T>**, **MQuery<T>** và `MDbContext` để thao tác với Entity Framework. Dưới đây giải thích một số khái niệm quan trọng.

## DbSet và Queryable

`DbSet<T>` là tập các thực thể được EF theo dõi. Thuộc tính `Queryable` trong `MRepository<T>` và `MQuery<T>` trả về truy vấn mặc định đã lọc những bản ghi `IsDeleted = false` nhằm tránh lấy dữ liệu đã xoá mềm. Bạn có thể nối thêm điều kiện hoặc dùng LINQ để truy vấn tiếp.

## SaveChangesAsync và SaveEntitiesAsync

`MDbContext` ghi đè `SaveChangesAsync` để tự động cập nhật các trường thời gian (`CreatedDateTS`, `LastModificationTime`, ...) trước khi gọi tới phương thức gốc của EF.

`SaveEntitiesAsync` dùng khi cần lưu dữ liệu và phát tán Domain Event. Phương thức này:
1. Cập nhật timestamp.
2. Nếu đang có transaction sẽ gọi `SaveChangesAsync` rồi phát tán sự kiện.
3. Nếu chưa có transaction thì tự tạo transaction mới, lưu dữ liệu, phát tán sự kiện rồi commit.

Khi dùng repository, các thao tác thêm/sửa/xoá sẽ gọi `SaveChangesAsync`. Nếu muốn bao quát nhiều thao tác trong một Unit of Work, hãy gọi `SaveEntitiesAsync` trên `MDbContext`.

## Domain Event

`MEntity` chứa danh sách `DomainEvents`. Repository sẽ gọi `entity.AddDomainEvent(...)` sau khi thay đổi. Khi `SaveEntitiesAsync` hoàn tất, `DispatchDomainEventsAsync` của `MDbContext` sẽ publish toàn bộ sự kiện thông qua MediatR.

Có hai nhóm sự kiện:
- **MEntityCreatedEvent**, **MEntityChangedEvent**, **MEntityDeletedEvent** cho một thực thể.
- **MEntitiesCreatedEvent**, **MEntitiesChangedEvent**, **MEntitiesDeletedEvent** cho nhiều thực thể (sử dụng trong `AddBatchAsync`, `DeleteBatchAsync`).

Trong các phương thức batch như `AddBatchAsync`, sự kiện `MEntities*Event` được
gắn vào phần tử đầu tiên của danh sách entity. `MDbContext` chỉ cần theo dõi
một thực thể để phát tán sự kiện cho toàn bộ batch. Bạn có thể thay đổi cơ chế
này bằng cách tự publish sự kiện riêng nếu muốn rõ ràng hơn.

## UnitOfWork

`MDbContext` triển khai `IMUnitOfWork` với các phương thức `BeginTransactionAsync`, `CommitTransactionAsync` và `RollbackTransaction`. `MRepository<T>` cung cấp thuộc tính `UnitOfWork` để truy cập DbContext hiện tại. Nhờ đó bạn có thể kết hợp nhiều repository trong cùng một transaction.

## Cấu hình DbContext

Sử dụng extension `AddDbContextConfigure<TDbContext, TPermission>(configuration)` trong `Program.cs` để đăng ký DbContext. Phương thức này hỗ trợ nhiều loại cơ sở dữ liệu và tự giải mã chuỗi kết nối nếu cần.

```csharp
services.AddDbContextConfigure<MyDbContext, MyPermission>(configuration);
```

Nếu sử dụng MongoDB, đặt `DbType` trong `appsettings.json` là `MongoDb` và extension sẽ cấu hình kết nối thích hợp.

---

## Phân trang với `MQuery`

`MQuery<T>` có phương thức `GetPagedAsync` giúp lấy dữ liệu theo trang kèm tổng
số bản ghi. Bạn truyền vào truy vấn gốc cùng số trang, kích thước và biểu thức
mapping sang DTO.

```csharp
IQueryable<MUser> query = _context.Set<MUser>().Where(x => !x.IsDeleted);
MPagedResult<UserDto> result = await GetPagedAsync(
    query,
    pageIndex: 1,
    pageSize: 10,
    selector: x => new UserDto { Id = x.EntityId, Name = x.Username });
```

`result` chứa `RowCount`, `CurrentPage`, `PageSize` và danh sách `Items` đã ánh
xạ.
