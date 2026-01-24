# Sử dụng Timing và IMDateTimeService

Tài liệu này giới thiệu các lớp trong thư mục `External/Timing` và cách sử dụng dịch vụ `IMDateTimeService`.

## 1. Các thành phần trong `External/Timing`

- **`IClockProvider`**: interface định nghĩa các thuộc tính `Now`, `UtcNow`, `Kind`, `SupportsMultipleTimezone` và phương thức `Normalize`.
- **`LocalClockProvider`**: trả về thời gian dựa trên múi giờ hệ thống (`DateTime.Now`).
- **`UtcClockProvider`**: luôn sử dụng thời gian UTC, hỗ trợ nhiều múi giờ.
- **`UnspecifiedClockProvider`**: giữ nguyên `DateTime` được truyền vào mà không chỉ rõ múi giờ.
- **`ClockProviders`**: cung cấp sẵn các instance `Unspecified`, `Local` và `Utc`.
- **`Clock`**: lớp tĩnh dùng để truy xuất thời gian thông qua `Clock.Provider`.

### 1.1 Sử dụng `Clock`

```csharp
// Đặt provider tại thời điểm khởi động
Clock.Provider = ClockProviders.Utc;

DateTime now = Clock.Now;      // tương đương Clock.Provider.Now
DateTime utc = Clock.UtcNow;   // tương đương Clock.Provider.UtcNow
DateTime normalized = Clock.Normalize(DateTime.Now);
```

Theo mặc định `Clock.Provider` là `ClockProviders.Unspecified`. Bạn có thể thay đổi provider trong `Program.cs` nếu muốn sử dụng UTC hay Local cho toàn bộ ứng dụng.

## 2. IMDateTimeService

`IMDateTimeService` được đăng ký tự động khi gọi `services.AddInfrastructure(...)`. Dịch vụ này cung cấp các phương thức:

```csharp
DateTime Now();
DateTime UtcNow();
DateTime Today();
DateTime UtcToday();
```

Bạn chỉ cần inject interface này vào class của mình:

```csharp
public class SampleHandler(IMDateTimeService dateTimeService)
{
    public void Handle()
    {
        DateTime current = dateTimeService.UtcNow();
    }
}
```

## 3. Khi nào dùng `Clock` và khi nào dùng `IMDateTimeService`

- **`Clock`** phù hợp khi bạn muốn thiết lập một provider thời gian duy nhất cho toàn bộ ứng dụng (ví dụ luôn dùng UTC). Đây là giải pháp toàn cục, dùng ở bất kỳ đâu mà không cần inject.
- **`IMDateTimeService`** thích hợp trong các class/handler cần DI để dễ kiểm thử. Bạn có thể mock interface này trong unit test thay vì phụ thuộc vào `DateTime.Now`.

Tóm lại, dùng `Clock` để cấu hình múi giờ chung và gọi nhanh ở những nơi không hỗ trợ DI. Dùng `IMDateTimeService` khi cần truyền dịch vụ thời gian qua constructor nhằm viết mã dễ kiểm thử hơn.
