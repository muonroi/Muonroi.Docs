# Permission Tree và Metadata UI

Tài liệu này giải thích cách cấu hình backend để lưu metadata cho quyền và đồng bộ chúng tới frontend dưới dạng cây. Phần cuối hướng dẫn các bước để FE tích hợp hiển thị menu và action dựa trên quyền.

## 1. Khai báo quyền

Tất cả quyền cần được định nghĩa trong `enum` và ánh xạ vào bảng `MPermissions`.

```csharp
[Flags]
public enum MyPermission
{
    User_View    = 1 << 0,
    User_Create  = 1 << 1,
    User_Edit    = 1 << 2,
    User_Delete  = 1 << 3
}
```

Sau khi thêm giá trị mới, hãy tạo bản ghi tương ứng trong bảng `MPermissions`. Các cột quan trọng gồm:

- **UiKey**: khoá duy nhất FE dùng để tra cứu.
- **ParentUiKey**: tham chiếu khoá cha (nếu có) giúp xây dựng cấu trúc cây.
- **Type**: `Menu`, `Tab` hoặc `Action`.
- **Label**, **Icon**, **Url** và **Description**: metadata để FE hiển thị.

Ví dụ quyền `User.Create` là nút bấm thuộc menu `user`:

```json
{
  "name": "User_Create",
  "uiKey": "user.create",
  "parentUiKey": "user",
  "type": "Action",
  "label": "Thêm mới",
  "icon": "plus"
}
```

## 2. API trả về cấu trúc quyền

`MAuthControllerBase` cung cấp các endpoint mặc định:

- `GET permission-definitions` – Đồng bộ danh sách quyền và nhóm quyền.
- `GET menu-metadata/{userId}` – Trả danh sách quyền kèm metadata theo nhóm.
- `GET permission-tree/{userId}` – Trả cây quyền cho người dùng.

Cấu trúc cây mẫu trả về như sau:

```json
[
  {
    "uiKey": "user",
    "name": "Quản lý người dùng",
    "icon": "user",
    "url": "/user",
    "publish": false,
    "type": "menu",
    "children": [
      {
        "uiKey": "user.view",
        "name": "Xem danh sách",
        "type": "action",
        "publish": false
      },
      {
        "uiKey": "user.create",
        "name": "Thêm mới",
        "type": "button",
        "publish": false
      }
    ]
  }
]
```

## 3. Tích hợp frontend

1. FE đăng nhập hoặc tải thông tin người dùng.
2. Gọi `permission-tree/{userId}` để lấy toàn bộ quyền đã cấp.
3. Dựa vào `uiKey`, `type` và metadata khác để render menu, nút bấm hoặc tab. Các thành phần chỉ hiển thị khi quyền có trong cây hoặc `publish = true`.
4. Nên cache kết quả tại FE để giảm số lần gọi API.

Ví dụ Angular sử dụng `PermissionService`:

```ts
constructor(private permissionSvc: PermissionService) {
  this.permissionSvc.load(userId);
}
```

Sau đó dùng directive:

```html
<button *appHasPermission="'profile.create'">Add User</button>
```


Với cách tổ chức trên, UI có thể hiển thị động mà không cần hardcode danh sách quyền.
