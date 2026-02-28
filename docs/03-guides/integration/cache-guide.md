# Hướng dẫn Cache

Thư viện cung cấp `AddMultiLevelCaching` để kích hoạt bộ nhớ đệm nhiều tầng (Memory + Redis). Cấu hình trong `CacheConfigs` và `RedisConfigs`.

```csharp
services.AddMultiLevelCaching(configuration);
```

Bạn cũng có thể sử dụng `MCacheExtension` trong các repository để lưu và lấy dữ liệu nhanh chóng.

## Samples
* **MemoryCache** - lưu trữ dữ liệu trong bộ nhớ của ứng dụng.
* **MultiLevelCache** - kết hợp bộ nhớ trong và Redis.
* **RedisCache** - sử dụng Redis làm bộ nhớ đệm phân tán.
* **MultipleCache** - ví dụ dùng kết hợp `IMemoryCache` và `IMultiLevelCacheService`.
