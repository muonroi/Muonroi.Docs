# Cấu hình Gateway

Tài liệu này hướng dẫn cấu hình ứng dụng sử dụng Muonroi Building Block khi triển khai phía sau các gateway phổ biến như **Kong** hoặc **Azure API Management** của Microsoft.

## Kong Gateway

1. Cài đặt Kong (có thể dùng bản Docker).
2. Đăng ký service trỏ tới địa chỉ của ứng dụng:
   ```bash
   curl -i -X POST http://localhost:8001/services/ \
        --data name=my-service \
        --data url=http://localhost:5000
   ```
3. Tạo route cho service:
   ```bash
   curl -i -X POST http://localhost:8001/services/my-service/routes \
        --data paths[]=/api
   ```
4. Tùy chọn cấu hình thêm plugin xác thực hoặc giới hạn truy cập.

## Azure API Management

1. Khởi tạo instance API Management trên Azure.
2. Import API của dự án (qua file OpenAPI hoặc tạo thủ công).
3. Cấu hình backend trỏ đến `http://localhost:5000` hoặc địa chỉ service thực tế.
4. Xuất bản API để gateway chuyển tiếp các yêu cầu tới dịch vụ.

Sau khi hoàn tất, gateway sẽ định tuyến các request đến ứng dụng xây dựng bằng Muonroi Building Block.
