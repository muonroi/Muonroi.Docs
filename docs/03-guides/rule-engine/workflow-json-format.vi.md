# Định dạng workflow JSON cho Rule Engine

`RulesEngineService` hỗ trợ hai kiểu định nghĩa workflow bằng JSON.

## 1. Dạng rút gọn

Workflow chỉ bao gồm `WorkflowName`, `Tenant` và danh sách mã rule. Mỗi phần tử trong mảng `Rules` là `Code` của một lớp hiện thực `IRule<T>` đã biên dịch sẵn.

```json
[
  {
    "WorkflowName": "login",
    "Tenant": "default",
    "Rules": [
      "ValidateLoginInfo",
      "LoadUser",
      "CheckAccountLock",
      "VerifyPassword",
      "GenerateToken"
    ]
  }
]
```

Trong chế độ này, điều kiện kiểm tra và các thuộc tính nằm trong mã C# của từng rule nên JSON không chứa `Expression` hay `Properties`.

## 2. Dạng đầy đủ (Microsoft RulesEngine)

Để mô tả điều kiện và hành động ngay trong JSON, sử dụng schema của [Microsoft RulesEngine](https://github.com/microsoft/RulesEngine). Mỗi phần tử `Rules` là một đối tượng có thể khai báo biểu thức điều kiện, hành động khi thành công/thất bại và các thuộc tính tùy chọn.

```json
[
  {
    "WorkflowName": "NumberWorkflow",
    "Tenant": "default",
    "Rules": [
      {
        "RuleName": "IsEven",
        "RuleExpressionType": "LambdaExpression",
        "Expression": "input1.value % 2 == 0",
        "Actions": {
          "OnSuccess": {
            "Name": "OutputExpression",
            "Context": {
              "expression": "input1.value * 2"
            }
          }
        },
        "Properties": {
          "Priority": 1,
          "Tag": "demo"
        }
      }
    ]
  }
]
```

- `Expression` xác định điều kiện của rule. Biểu thức được viết bằng cú pháp C# và có thể truy cập giá trị context thông qua `input1.value`.
- `Actions` mô tả hành động thực thi. Ví dụ trên sử dụng hành động `OutputExpression` để ghi giá trị nhân đôi vào `FactBag`.
- `Properties` là một từ điển key/value cho phép gắn siêu dữ liệu (ví dụ `Priority` hoặc nhãn tùy chỉnh). Các giá trị này có thể đọc trong quá trình chạy thông qua `result.Rule.Properties`.

## Thực thi workflow

```csharp
FileRuleSetStore store = new("rules");
RulesEngineService service = new(store);
await service.SaveRuleSetAsync("NumberWorkflow", json);
FactBag bag = await service.ExecuteAsync("NumberWorkflow", 3);
int doubled = bag.Get<int>("IsEven");
```

`FileRuleSetStore` tự động tách dữ liệu theo tenant dựa trên `TenantContext.CurrentTenantId`. Việc đặt `Tenant` trong JSON giúp bạn quản lý file dễ dàng nhưng không ảnh hưởng tới việc thực thi.

