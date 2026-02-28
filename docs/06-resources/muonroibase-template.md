# Sử dụng muonroibase.template

Template `muonroibase.template` cung cấp một dự án mẫu đã tích hợp sẵn Muonroi Building Block.
Đây là cách nhanh nhất để khởi tạo ứng dụng WebAPI sử dụng thư viện.

## Cài đặt template

```bash
dotnet new install muonroibase.template
```

Lệnh trên tải template từ NuGet và đăng ký với `dotnet new`.

## Tạo dự án mới

```bash
dotnet new muonroibase -n MyService
```

Kết quả sẽ tạo thư mục `MyService` với cấu trúc dự án mẫu gồm:

- `Program.cs` cấu hình sẵn Muonroi Building Block.
- `appsettings.json` mẫu.
- Các script tiện ích trong thư mục `scripts/`.

Sau khi tạo, bạn chỉ cần chỉnh lại namespace và bổ sung cấu hình theo nhu cầu.

Xem thêm [Quick Start](quickstart.md) để chạy thử.
