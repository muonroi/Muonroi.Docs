# Cách ly dữ liệu lưu trữ theo tenant

Để bảo vệ dữ liệu của từng tenant khi dùng Object Storage, có hai chiến lược phổ biến:

## Bucket riêng cho mỗi tenant

- Tạo một bucket riêng `tenant-{id}`.
- Gán IAM/ACL chỉ cho tenant truy cập bucket của mình.
- Phù hợp khi số lượng tenant nhỏ hoặc cần phân tách hoàn toàn.

## Prefix theo tenant trong cùng bucket

- Dùng chung một bucket, đặt dữ liệu vào prefix `tenant/{id}/`.
- Áp dụng policy IAM/ACL giới hạn quyền trên từng prefix.
- Dễ quản lý khi có nhiều tenant nhưng vẫn đảm bảo cách ly.

Cả hai lựa chọn cần kiểm soát quyền truy cập chặt chẽ và audit đầy đủ.
