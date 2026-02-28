# Hướng dẫn nâng cấp Muonroi Building Block

Tài liệu này mô tả các bước đề xuất để cập nhật thư viện **Muonroi.Building Block** lên phiên bản mới nhất.

## 1. Chuẩn bị môi trường
- Cài đặt **.NET SDK 9.0** hoặc mới hơn. Có thể cài đặt nhanh bằng script `dotnet-install.sh` trong kho mã:
  ```bash
  ./dotnet-install.sh -c STS --install-dir $HOME/.dotnet
  export PATH="$PATH:$HOME/.dotnet"
  ```

## 2. Nâng cấp gói NuGet
- Chạy lệnh bên dưới trong thư mục dự án để cập nhật gói lên phiên bản mới nhất:
  ```bash
  dotnet add package Muonroi.BuildingBlock --version 1.6.5
  ```
- Đối với nhiều dự án, có thể sử dụng script `update-nuget-packages.ps1` để tự động quét và cập nhật:
  ```bash
  pwsh ./update-nuget-packages.ps1
  ```

## 3. Cập nhật cấu hình
- Kiểm tra lại file `appsettings.json` và bổ sung các phần cấu hình mới nếu có, ví dụ cấu hình `Serilog` hoặc `MessageBusConfigs`.
- Tham khảo thêm tại tài liệu [usage-guide](./usage-guide.md).

## 4. Kiểm tra và build lại
- Sau khi cập nhật, chạy lệnh:
  ```bash
  dotnet build Muonroi.BuildingBlock.sln -c Release
  ```
- Đảm bảo quá trình build không xuất hiện lỗi trước khi tiếp tục tích hợp.

