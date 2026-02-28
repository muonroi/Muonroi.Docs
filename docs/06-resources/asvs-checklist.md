# ASVS Checklist

Use this checklist to verify common security requirements before merging changes. The items reference [OWASP ASVS](https://owasp.org/ASVS/).

## V14 Security Configuration
- [ ] Use secure defaults and disable verbose errors in production.
- [ ] Store secrets outside of source control (ASVS 14.2.2).
- [ ] Ensure HTTPS is enforced and certificates are validated.

## V5 Input Validation
- [ ] Validate all inputs for type, length, and range (ASVS 5.3.2).
- [ ] Encode output for the target interpreter to prevent injection.
- [ ] Reject unexpected or malformed data with clear errors.

## V4 Access Control
- [ ] Enforce role-based authorization and deny by default (ASVS 4.1.3).
- [ ] Verify the current user owns the resource being accessed.
- [ ] Log and alert on authorization failures.

=======
# ASVS Checklist cho Web API

Bảng kiểm dưới đây tham chiếu [OWASP ASVS](https://owasp.org/ASVS) và được dùng như tiêu chí "done" cho các PR.

| Mục                | Mô tả                                                                                 | L1 | L2 | L3 |
| ------------------ | -------------------------------------------------------------------------------------- | -- | -- | -- |
| Xác thực           | Kiểm tra cơ chế đăng nhập, mật khẩu mạnh, bảo vệ brute force                           | ✅ | ✅ | ✅ |
| Quản lý phiên / Refresh token | Hết hạn hợp lý, bảo vệ rò rỉ, xoay refresh token                           | ✅ | ✅ | ✅ |
| Kiểm soát truy cập | Ánh xạ ma trận vai trò/quyền tới endpoint, kiểm thử ủy quyền                           | ✅ | ✅ | ✅ |
| Đầu vào/đầu ra      | Validate & encode dữ liệu, tránh injection (ASVS 5.3.2), từ chối dữ liệu sai định dạng | ✅ | ✅ | ✅ |
| Cấu hình bảo mật   | Bật HTTPS, bảo vệ header, cấu hình framework an toàn, tắt verbose error, secrets không lưu trong source control (ASVS 14.2.2) | ✅ | ✅ | ✅ |

> Tham chiếu chi tiết: [OWASP ASVS](https://owasp.org/ASVS/).

