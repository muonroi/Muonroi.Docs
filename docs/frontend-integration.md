# Hướng dẫn tích hợp Frontend

Tài liệu này trình bày một số lưu ý khi tích hợp Muonroi Building Block với ứng dụng Angular hoặc Flutter.

## 1. Angular

- Lưu `access token` và `refresh token` vào `localStorage` hoặc `sessionStorage`.
- Sử dụng `HttpInterceptor` để tự động thêm header `Authorization`:

```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenSvc: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.tokenSvc.getAccessToken();
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next.handle(req);
  }
}
```

- Định kỳ gọi API `/refresh-token` để lấy token mới khi sắp hết hạn.
- Sử dụng `CanActivate` hoặc `RouteGuard` để kiểm tra quyền trước khi vào trang.
- Đồng bộ `permission tree` và `permission definitions` bằng `PermissionService` rồi dùng `HasPermissionDirective` và `permissionGuard` để ẩn/hiện UI, bảo vệ route.

## 2. Flutter

- Sử dụng thư viện `dio` để gửi request và thêm interceptor:

```dart
class AuthInterceptor extends Interceptor {
  final TokenStore store;
  AuthInterceptor(this.store);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = store.accessToken;
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    super.onRequest(options, handler);
  }
}
```

- Lưu token bằng `SharedPreferences` và tự động refresh khi nhận mã lỗi 401.
- Bảo vệ màn hình bằng cách kiểm tra token và quyền của người dùng trước khi hiển thị.

## 3. Tham khảo

- [Hướng dẫn Token](token-guide.vi.md)
