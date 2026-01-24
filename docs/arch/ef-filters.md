# EF Core Global Query Filters

Sử dụng [Global Query Filters](https://learn.microsoft.com/ef/core/querying/filters) để cưỡng chế tầng ứng dụng cho mô hình đa tenant. `AppDbContext` lặp qua các entity kế thừa `MEntity` và tự động thêm điều kiện `TenantId` hiện tại. Nếu entity có cờ `IsDeleted`, filter sẽ kết hợp để loại bỏ dữ liệu đã xóa mềm.

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    foreach (var entityType in modelBuilder.Model.GetEntityTypes())
    {
        if (!typeof(MEntity).IsAssignableFrom(entityType.ClrType)) continue;
        var parameter = Expression.Parameter(entityType.ClrType, "e");
        Expression? filter = null;

        var tenantProp = entityType.FindProperty("TenantId");
        if (tenantProp?.ClrType == typeof(string))
        {
            var tenant = Expression.Property(parameter, tenantProp.PropertyInfo!);
            var current = Expression.Property(null, typeof(TenantContext), nameof(TenantContext.CurrentTenantId));
            filter = Expression.Equal(tenant, current);
        }

        var deletedProp = entityType.FindProperty(nameof(MEntity.IsDeleted));
        if (deletedProp?.ClrType == typeof(bool))
        {
            var isDeleted = Expression.Property(parameter, deletedProp.PropertyInfo!);
            var notDeleted = Expression.Equal(isDeleted, Expression.Constant(false));
            filter = filter is null ? notDeleted : Expression.AndAlso(filter, notDeleted);
        }

        if (filter is not null)
            entityType.SetQueryFilter(Expression.Lambda(filter, parameter));
    }
}
```

## Bỏ qua filter
Dùng `IgnoreQueryFilters()` khi cần truy vấn toàn bộ dữ liệu (ví dụ cho tác vụ quản trị hoặc migration):

```csharp
var all = context.Blogs.IgnoreQueryFilters().ToList();
```

## Kết hợp nhiều filter
EF Core chỉ cho phép một `HasQueryFilter` mỗi entity, vì vậy cần kết hợp các điều kiện bằng `Expression.AndAlso`. Cách này đảm bảo dữ liệu được phân tách theo `TenantId` và đồng thời ẩn các bản ghi `IsDeleted`.
