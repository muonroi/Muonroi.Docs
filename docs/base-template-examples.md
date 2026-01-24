# Muonroi BaseTemplate Examples

Tài liệu này minh họa cách tạo dự án từ `Muonroi.BaseTemplate` và gọi các API mẫu.

## Tạo dự án

```bash
dotnet new install ./src/Muonroi.Base.Template
dotnet new mr-base-sln -n DemoService
```

## Sử dụng API mẫu

Sau khi khởi tạo, template đã có sẵn `SampleEntity`, `ISampleRepository` và `ISampleQuery`.
Bạn có thể thử các endpoint sau:

- `POST /api/sample` – tạo bản ghi mới.
- `GET /api/sample` – lấy danh sách mẫu.

Các lệnh và handler nằm trong thư mục `Application/Commands/Sample`.
Dựa trên ví dụ này, bạn có thể mở rộng để khai thác tối đa `Muonroi.BuildingBlock`.

## Rule Engine mẫu

Template còn tích hợp một **rule engine** minh họa cách đánh giá luật bằng thư viện `Muonroi.RuleEngine`.

### Đăng ký và quét rule

Trong `RegisterService`, rule engine được thêm vào DI và tự động quét tất cả các lớp `IRule<T>` trong assembly:

```csharp
services.AddRuleEngine().AddRulesFromAssemblies(typeof(RegisterService).Assembly);
```

Nhờ đó mọi rule đánh dấu `[RuleGroup("numbers")]` sẽ được tìm thấy mà không cần đăng ký thủ công.

### Viết rule và hook

Mỗi rule triển khai `IRule<int>` và có thể khai báo phụ thuộc lẫn nhau. Ví dụ `SquareRule` phụ thuộc `RangeRule` và `EvenRule`:

```csharp
[RuleGroup("numbers")]
public sealed class SquareRule : IRule<int>
{
    public IEnumerable<Type> Dependencies => new[] { typeof(RangeRule), typeof(EvenRule) };

    public Task<RuleResult> EvaluateAsync(int context, FactBag facts, CancellationToken cancellationToken = default)
    {
        int square = context * context;
        facts["square"] = square;
        return Task.FromResult(RuleResult.Passed());
    }
}
```

Ngoài ra còn có `LoggingHook` triển khai `IHookHandler<int>` để log kết quả trước và sau khi mỗi rule chạy.

### Thực thi

`EvaluateNumberQueryHandler` nhận `RuleOrchestrator<int>` và thực thi toàn bộ rule đã đăng ký, trả về `FactBag` chứa các giá trị:

```csharp
FactBag facts = await _orchestrator.ExecuteAsync(request.Value, cancellationToken);
```

API `GET /api/rules/evaluate/{value}` trong `RulesController` gọi handler này và trả về kết quả đánh giá.

Ví dụ:

```bash
GET /api/rules/evaluate/4
```

Kết quả chứa các flag như `positive`, `even`, `range` và giá trị `square`.

### Dự án mẫu sử dụng mediator

Kho lưu trữ có thêm ví dụ `Samples/RuleEngineMediator` minh họa cách kết
hợp rule engine với `IMediator`. Dự án này thực thi trực tiếp
`RuleOrchestrator<int>` (ví dụ cơ bản) và gửi `EvaluateNumberQuery`
thông qua mediator để thực thi các rule phụ thuộc lẫn nhau (ví dụ nâng
cao). Chạy thử bằng:

```bash
dotnet run --project Samples/RuleEngineMediator
```

### Rule có điều kiện với dịch vụ bên ngoài

Base template còn cung cấp ví dụ `CreateContainerCommand` minh họa cách handler sử dụng rule có điều kiện:

- `ContainerExistenceRule` gọi dịch vụ **gRPC** để kiểm tra container đã tồn tại.
- `ContainerValidationRule` gọi API **REST** để lấy thông tin như container rời cảng hoặc hết vòng đời.

Handler `CreateContainerCommandHandler` thực thi `RuleOrchestrator`. Nếu bất kỳ rule nào thất bại, thông báo lỗi sẽ được trả về thay vì tạo container. Khi mọi rule đều đạt, container sẽ được tạo thành công.
