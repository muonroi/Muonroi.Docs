# Danh sách Extension và cách sử dụng

Tài liệu này mô tả chi tiết các phương thức mở rộng trong thư mục `External/Extensions`. Mỗi hàm đều có ví dụ và giải thích ý nghĩa để người dùng dễ áp dụng.

## DbContextExtensions

### BulkInsertAsync<T>(DbContext dbContext, IEnumerable<T> entities)
Thêm một danh sách bản ghi vào `DbContext` trong một transaction. Phương thức tự rollback nếu gặp lỗi.
```csharp
await dbContext.BulkInsertAsync(listEntity);
```

## JsonExtensions

### Serialize(this object obj)
Chuyển đối tượng bất kỳ sang chuỗi JSON. Bỏ qua vòng tham chiếu và giá trị mặc định.
```csharp
string json = myObject.Serialize();
```

## MConfigurationExtension

### GetOptions<T>(IConfiguration configuration, string section)
Tương tự phương thức trên nhưng truyền trực tiếp `IConfiguration`.

### GetCryptConfigValue(...)
Nhiều overload giải mã giá trị cấu hình đã được mã hoá. Có thể chọn truyền khoá bí mật hoặc dùng khoá lưu trong cấu hình (`SecretKey`).

### GetCryptConfigValueCipherText(IConfiguration configuration, string cipherText)
Giải mã một chuỗi đã mã hoá sẵn nhờ khoá bí mật trong cấu hình.

### ConfigureDictionary<TOptions>(IServiceCollection services, IConfigurationSection section)
Bind các cặp key/value từ cấu hình vào `Dictionary` tùy ý.

### ConfigureStartupConfig<TConfig>(IServiceCollection services, IConfiguration configuration)
Bind toàn bộ cấu hình vào lớp `TConfig` khởi tạo lúc startup.

## MCryptographyExtension

Các hàm hỗ trợ mã hoá/giải mã và sinh hash:
- `Decrypt(string key, string cipherText)` giải mã AES với khoá và IV mặc định.
- `GenerateSha256String(string inputString)` tạo chuỗi SHA256.
- `GenerateHmacSha512(string key, string inputData)` sinh chữ ký HMAC SHA512.
- `MD5Hash`, `EncryptMd5`, `EncryptMd5Sha256WithSalt` sinh mã băm từ chuỗi.
- `Sha256(string value)` tạo hash SHA256 thuần tuý.

## MDateTimeExtension

- `IsTheSameDate(DateTime src, DateTime des)` so sánh hai ngày không xét thời gian.
- `TimeStampToDate(double timeStamp)` chuyển Unix timestamp sang `Date`.
- `TimeStampToDateTime(double timeStamp)` chuyển Unix timestamp sang `DateTime`.
- `GetTimeStamp(DateTime dateTime, bool includedTimeValue = false)` lấy timestamp từ `DateTime`.
- `GetTimeZoneExpiryDate(DateTimeOffset dt, int zoneHour)` đổi múi giờ hết hạn.
- `GreaterThanWithoutDay(DateTime dtFrom, DateTime dtTo)` so sánh năm/tháng.
- `ConverTimestampToYearMonth(double)` và `ConvertTimestampToYearMonthDay(double)` đổi timestamp thành dạng số `yyyyMM` hoặc `yyyyMMdd`.
- `ToUTC(DateTime dateTime)` chuyển `DateTime` về UTC.

## MGenericTypeExtension

- `GetGenericTypeName(this Type type)` trả về tên đầy đủ của kiểu generic.
- `GetGenericTypeName(this object obj)` lấy tên kiểu generic từ instance.

## MHttpContextExtension

- `GetRequestedIpAddress(HttpContext httpContext)` lấy địa chỉ IP của client, tự xử lý header `X-FORWARDED-FOR`.
- `GetHeaderUserAgent(HttpContext httpContext)` đọc header `User-Agent`.

## MLockExtension

Các hàm thực thi delegate trong khối `lock` để đảm bảo thread safety:
- `Locking(this object source, Action action)`
- `Locking<T>(this T source, Action<T> action) where T : class`
- `Locking<TResult>(this object source, Func<TResult> func)`
- `Locking<T, TResult>(this T source, Func<T, TResult> func) where T : class`

## MPermissionExtension

### CalculatePermissionsBitmask(List<TPermission> userPermissions)
Gom danh sách quyền (enum) thành bitmask số để lưu trữ và so sánh.

## MStringExtention

- `NormalizeString(string)` bỏ dấu và khoảng trắng, chuyển về chữ thường.
- `Truncate(string, int)` cắt chuỗi ở độ dài tối đa.
- `DecryptConfigurationValue(IConfiguration, string?, bool, string)` giải mã chuỗi cấu hình dựa vào tuỳ chọn `EnableEncryption`.
- `ToBase64String(string)` và `FromBase64String(string)` mã hoá/giải mã Base64.
- `Left(string, int)` lấy `len` ký tự đầu của chuỗi.

## MSequentialGuidGenerator

Cung cấp cách tạo `Guid` tuần tự để tối ưu chỉ mục trong cơ sở dữ liệu.

- Thuộc tính `Instance` trả về singleton sử dụng chung.
- `DatabaseType` chọn kiểu DB (SqlServer, Oracle, MySql, PostgreSql).
- `Create()` sinh `Guid` theo `DatabaseType` hiện tại.
- `Create(SequentialGuidDatabaseType dbType)` sinh theo DB truyền vào.
- `Create(SequentialGuidType guidType)` tuỳ chọn vị trí phần tuần tự (đầu/cuối).

