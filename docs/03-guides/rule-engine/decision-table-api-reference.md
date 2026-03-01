# Decision Table API Reference

Namespace: `Muonroi.RuleEngine.DecisionTable.Web.Controllers`

Base route: `/api/v1/decision-tables`

## 1. List and query

- `GET /api/v1/decision-tables`
  - Query params:
    - `page` (default: `1`)
    - `pageSize` (default: `20`)
    - `search` (optional)
    - `tenantId` (optional)
    - `hitPolicy` (optional)
    - `includeDeleted` (default: `false`)
  - Response shape:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 0
}
```

## 2. CRUD

- `GET /api/v1/decision-tables/{id}`
  - Get table detail.
- `POST /api/v1/decision-tables`
  - Create a table.
- `PUT /api/v1/decision-tables/{id}`
  - Update a table.
- `DELETE /api/v1/decision-tables/{id}`
  - Soft delete a table.

## 3. Bulk operations

- `POST /api/v1/decision-tables/bulk/upsert`
  - Request:

```json
{
  "tables": [
    { "id": "table-a", "name": "Table A", "hitPolicy": "FIRST", "inputColumns": [], "outputColumns": [], "rows": [] }
  ],
  "actor": "admin",
  "reason": "seed"
}
```

- `POST /api/v1/decision-tables/bulk/delete`
  - Request:

```json
{
  "ids": ["table-a", "table-b"],
  "actor": "admin",
  "reason": "cleanup"
}
```

Bulk response (`upsert` and `delete`):

```json
{
  "processedCount": 2,
  "ids": ["table-a", "table-b"]
}
```

## 4. Row reorder (drag-drop support)

- `POST /api/v1/decision-tables/{id}/rows/reorder`
  - Request:

```json
{
  "rowIds": ["row-3", "row-1", "row-2"],
  "actor": "admin",
  "reason": "drag-drop"
}
```

  - Response: updated `DecisionTable` object.

## 5. Validation and export

- `POST /api/v1/decision-tables/{id}/validate`
  - Returns `ValidationResult` with `isValid`, `errors[]`, `warnings[]`.

Base route for export: `/api/v1/decision-tables/{id}/export`

- `POST /json`
  - Returns workflow JSON (`application/json`).
- `POST /dmn`
  - Returns DMN XML (`application/xml`).

## 6. Version history

- `GET /api/v1/decision-tables/{id}/versions?page=1&pageSize=20`
  - Returns a list of version snapshots.
- `GET /api/v1/decision-tables/{id}/versions/{version}`
  - Returns a single version snapshot.

Version snapshot:

```json
{
  "tableId": "table-a",
  "version": 3,
  "changeType": "update",
  "actor": "admin",
  "reason": "policy update",
  "timestamp": "2026-03-01T10:00:00Z",
  "table": { "id": "table-a", "name": "Table A" }
}
```

## 7. Audit trail

- `GET /api/v1/decision-tables/{id}/audit?page=1&pageSize=50`
  - Table-level audit entries.
- `GET /api/v1/decision-tables/audit?page=1&pageSize=50`
  - Global audit entries.

Audit entry shape:

```json
{
  "id": 101,
  "tableId": "table-a",
  "action": "reorder-rows",
  "actor": "admin",
  "reason": "drag-drop",
  "timestamp": "2026-03-01T10:05:00Z",
  "payloadJson": "{...}"
}
```

## 8. Status codes

- `200 OK`: successful read/update/export/validate.
- `201 Created`: successful create.
- `204 NoContent`: successful delete.
- `400 BadRequest`: invalid payload/validation failed.
- `404 NotFound`: table or version not found.

## 9. Store interface summary

`IDecisionTableStore` now includes:

- `QueryAsync(...)`
- `GetAllAsync(...)`
- `GetByIdAsync(...)`
- `SaveAsync(...)`
- `BulkUpsertAsync(...)`
- `BulkDeleteAsync(...)`
- `ReorderRowsAsync(...)`
- `GetVersionHistoryAsync(...)`
- `GetVersionAsync(...)`
- `GetAuditTrailAsync(...)`
- `DeleteAsync(...)`
