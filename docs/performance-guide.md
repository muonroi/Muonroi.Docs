# Performance Guide

Hướng dẫn tối ưu performance cho ứng dụng sử dụng Muonroi.BuildingBlock.

## Vấn đề thường gặp

### 1. Login/Register API chậm

**Nguyên nhân:**
- Login flow sử dụng Rule Engine với 5 rules tuần tự
- Query permissions join 5 bảng: `MUser` → `MUserRole` → `MRole` → `MRolePermission` → `MPermission`
- BCrypt password hashing (intentionally slow for security)
- Multiple database roundtrips

**Giải pháp:**

#### A. Thêm Database Indexes

Tạo migration để thêm indexes cho các bảng auth:

```csharp
public partial class AddAuthIndexes : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // User lookup by username
        migrationBuilder.CreateIndex(
            name: "IX_MUsers_UserName",
            table: "MUsers",
            column: "UserName");

        // User roles lookup
        migrationBuilder.CreateIndex(
            name: "IX_MUserRoles_UserId",
            table: "MUserRoles",
            column: "UserId");

        // Role permissions lookup
        migrationBuilder.CreateIndex(
            name: "IX_MRolePermissions_RoleId",
            table: "MRolePermissions",
            column: "RoleId");

        // Refresh token lookup
        migrationBuilder.CreateIndex(
            name: "IX_MRefreshTokens_TokenValidityKey",
            table: "MRefreshTokens",
            column: "TokenValidityKey");

        // Login attempts lookup
        migrationBuilder.CreateIndex(
            name: "IX_MUserLoginAttempts_UserId",
            table: "MUserLoginAttempts",
            column: "UserId");
    }
}
```

#### B. Giảm Logging Level

Trong `appsettings.json`:

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Warning",  // Thay vì "Information" hoặc "Debug"
      "Override": {
        "Microsoft.AspNetCore": "Warning",
        "Microsoft.EntityFrameworkCore": "Warning",
        "System": "Warning"
      }
    }
  }
}
```

#### C. Disable unused features

```json
{
  "FeatureFlags": {
    "UseGrpc": false,
    "UseServiceDiscovery": false,
    "UseMessageBus": false,
    "UseBackgroundJobs": false
  }
}
```

### 2. Application Startup chậm

**Nguyên nhân:**
- Loading nhiều services
- Database migration check
- gRPC, Consul, Kafka initialization

**Giải pháp:**

#### A. Disable unused integrations

```json
{
  "FeatureFlags": {
    "UseGrpc": false,
    "UseServiceDiscovery": false,
    "UseMessageBus": false,
    "UseBackgroundJobs": false
  }
}
```

#### B. Lazy initialization cho optional services

Services như Consul, Kafka sẽ chỉ được khởi tạo khi `FeatureFlags` tương ứng = `true`.

### 3. Database Queries chậm

**Nguyên nhân:**
- N+1 queries
- Missing indexes
- Không sử dụng AsNoTracking cho read-only queries

**Giải pháp:**

#### A. Sử dụng AsNoTracking cho read-only queries

```csharp
var users = await _dbContext.Set<MUser>()
    .AsNoTracking()  // Không track changes
    .ToListAsync();
```

#### B. Eager loading với Include

```csharp
var user = await _dbContext.Set<MUser>()
    .Include(u => u.Roles)
    .ThenInclude(r => r.Permissions)
    .FirstOrDefaultAsync(u => u.Id == userId);
```

### 4. Caching

#### A. Enable Redis caching

```json
{
  "CacheConfigs": {
    "CacheType": "MultiLevel"  // Memory + Redis
  },
  "RedisConfigs": {
    "Enable": true,
    "Host": "localhost",
    "Port": "6379",
    "Expire": 30
  }
}
```

#### B. Cache permissions

Permissions được cache tự động trong Redis với key `TokenValidityKey`.

### 5. Production Optimizations

#### A. Enable Response Compression

Thêm vào `Program.cs`:

```csharp
services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

// ...

app.UseResponseCompression();
```

#### B. Use Release build

```bash
dotnet run --configuration Release
```

#### C. Optimize EF Core queries

Trong `DbContext`:

```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
}
```

## Performance Checklist

### Development

- [ ] Logging level = `Debug` or `Information`
- [ ] Redis disabled (`RedisConfigs.Enable: false`)
- [ ] FeatureFlags minimal
- [ ] SQLite for quick iteration

### Production

- [ ] Logging level = `Warning` or `Error`
- [ ] Redis enabled for caching
- [ ] Database indexes created
- [ ] Only needed FeatureFlags enabled
- [ ] Release build
- [ ] Response compression enabled

## Profiling

### Sử dụng MiniProfiler

```csharp
services.AddMiniProfiler(options =>
{
    options.RouteBasePath = "/profiler";
});
```

### Sử dụng EF Core Query Logging

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Override": {
        "Microsoft.EntityFrameworkCore.Database.Command": "Information"
      }
    }
  }
}
```

## Benchmark Reference

Với configuration tối ưu:

| API | Expected Response Time |
|-----|------------------------|
| Login | < 500ms |
| Register | < 300ms |
| Get User | < 100ms |
| List Users (100 items) | < 200ms |

> **Note:** BCrypt password hashing intentionally takes ~100-300ms for security. This is expected behavior.
