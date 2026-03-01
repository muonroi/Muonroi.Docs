# Decision Table Full Upgrade Guide (2026)

This guide documents the full Decision Table upgrade implemented across:

- `Muonroi.RuleEngine.DecisionTable`
- `Muonroi.RuleEngine.DecisionTable.Web`
- `@muonroi/ui-engine-decision-table`

## 1. Scope completed

The following production gaps were implemented end-to-end:

1. SQL Server persistence (EF Core store, no longer only in-memory).
2. Search/filter for list API.
3. Bulk upsert and bulk delete APIs.
4. Row reorder API for drag-drop runtime UI.
5. Audit trail storage and API.
6. Version history storage and API.

## 2. Architecture changes

## 2.1 Store contract

`IDecisionTableStore` now supports:

- `QueryAsync(...)` with paging + filter.
- `BulkUpsertAsync(...)` and `BulkDeleteAsync(...)`.
- `ReorderRowsAsync(...)`.
- `GetVersionHistoryAsync(...)` and `GetVersionAsync(...)`.
- `GetAuditTrailAsync(...)`.

## 2.2 Persistence modes

- Default mode (no SQL connection): `InMemoryDecisionTableStore`.
- SQL mode (when configured): `EfCoreDecisionTableStore`.

New EF tables:

- `DecisionTables`
- `DecisionTableVersions`
- `DecisionTableAuditLogs`

## 2.3 Bootstrapping and migration

New options:

```csharp
public sealed class DecisionTableEngineOptions
{
    public string? SqlServerConnectionString { get; set; }
    public string Schema { get; set; } = "dbo";
    public bool AutoMigrateDatabase { get; set; } = true;
}
```

Runtime behavior:

- If migrations exist: auto `Migrate()` on startup.
- If no migrations exist: auto `EnsureCreated()` on startup.

## 3. Backend setup guide

## 3.1 Configure DI

```csharp
builder.Services.AddDecisionTableWeb(options =>
{
    options.SqlServerConnectionString = builder.Configuration.GetConnectionString("DecisionTableSql");
    options.Schema = "rule";
    options.AutoMigrateDatabase = true;
});
```

If you do not pass options or do not set `SqlServerConnectionString`, the module runs in-memory.

## 3.2 Example appsettings.json

```json
{
  "ConnectionStrings": {
    "DecisionTableSql": "Server=.;Database=MuonroiRules;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

## 4. API endpoints (new + existing)

Base route: `/api/v1/decision-tables`

## 4.1 List with filters

`GET /api/v1/decision-tables?page=1&pageSize=20&search=risk&tenantId=t1&hitPolicy=FIRST&includeDeleted=false`

Query params:

- `page`, `pageSize`
- `search`
- `tenantId`
- `hitPolicy`: `FIRST`, `UNIQUE`, `COLLECT`, `PRIORITY`, `OUTPUT_ORDER`, `COLLECT_SUM`, `COLLECT_MIN`, `COLLECT_MAX`, `COLLECT_COUNT`
- `includeDeleted`

Response:

```json
{
  "items": [
    { "id": "...", "name": "RiskTable", "version": 3 }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

## 4.2 Bulk operations

- `POST /api/v1/decision-tables/bulk/upsert`
- `POST /api/v1/decision-tables/bulk/delete`

Example bulk upsert request:

```json
{
  "tables": [
    { "id": "table-a", "name": "A", "hitPolicy": "FIRST", "inputColumns": [], "outputColumns": [], "rows": [] },
    { "id": "table-b", "name": "B", "hitPolicy": "FIRST", "inputColumns": [], "outputColumns": [], "rows": [] }
  ],
  "actor": "admin",
  "reason": "seed"
}
```

Response:

```json
{
  "processedCount": 2,
  "ids": ["table-a", "table-b"]
}
```

## 4.3 Row reorder (drag-drop runtime)

`POST /api/v1/decision-tables/{id}/rows/reorder`

Request:

```json
{
  "rowIds": ["row-3", "row-1", "row-2"],
  "actor": "admin",
  "reason": "drag-drop"
}
```

Behavior:

- Row order is normalized to `1..N` in supplied sequence.
- New version snapshot is created.
- Audit entry `reorder-rows` is added.

## 4.4 Version history

- `GET /api/v1/decision-tables/{id}/versions?page=1&pageSize=20`
- `GET /api/v1/decision-tables/{id}/versions/{version}`

## 4.5 Audit trail

- `GET /api/v1/decision-tables/{id}/audit?page=1&pageSize=50`
- `GET /api/v1/decision-tables/audit?page=1&pageSize=50` (global)

## 4.6 Existing endpoints kept

- `GET /{id}`
- `POST /`
- `PUT /{id}`
- `DELETE /{id}`
- `POST /{id}/validate`
- `POST /{id}/export/json`
- `POST /{id}/export/dmn`

## 5. UI package usage (`@muonroi/ui-engine-decision-table`)

## 5.1 API client methods added

```ts
const api = new MDecisionTableApiClient({ apiBase: "/api/v1/decision-tables" });

await api.MList({ page: 1, pageSize: 20, search: "risk", hitPolicy: "FIRST" });
await api.MBulkUpsert([tableA, tableB], "admin", "seed");
await api.MBulkDelete(["table-a"], "admin", "cleanup");
await api.MReorderRows("table-a", ["row-2", "row-1"], "admin", "drag-drop");
await api.MGetVersions("table-a", 1, 20);
await api.MGetAudit("table-a", 1, 50);
```

## 5.2 Editor model methods added

```ts
const model = new MDecisionTableEditorModel({ apiBase: "/api/v1/decision-tables" });

model.MReorderRows(["row-2", "row-1"]);  // local order update
await model.MPersistRowOrder("admin", "drag-drop");

await model.MBulkUpsert([model.MGetTable()], "admin", "seed");
await model.MBulkDelete(["table-a"], "admin", "cleanup");

const versions = await model.MLoadVersionHistory();
const audit = await model.MLoadAuditTrail();
```

## 5.3 PrimeNG toolbar actions added

The PrimeNG adapter now includes:

- `reorder`
- `bulk-save`
- `bulk-delete`

These are intended to bind to drag-drop and batch UI actions at runtime.

## 6. Drag-drop runtime pattern (PrimeNG)

Sample integration pattern:

```ts
onDrop(newOrder: string[]) {
  this.model.MReorderRows(newOrder);
  this.model.MPersistRowOrder("admin", "drag-drop")
    .then(() => this.toast.success("Row order saved"))
    .catch((error) => this.toast.error(error.message));
}
```

## 7. Test checklist used

Backend:

```bash
dotnet test tests/Muonroi.RuleEngine.DecisionTable.Tests/Muonroi.RuleEngine.DecisionTable.Tests.csproj -v minimal
```

UI package:

```bash
npm test --workspace @muonroi/ui-engine-decision-table
npm run build --workspace @muonroi/ui-engine-decision-table
```

Validated:

- CRUD + validate + export.
- Filtered list query.
- Row reorder.
- Version history retrieval.
- Audit trail retrieval.
- Bulk upsert/delete.
- TypeScript strict build and tests.

## 8. Rollout recommendations

1. Enable SQL mode in staging first and verify table creation (`DecisionTables`, `DecisionTableVersions`, `DecisionTableAuditLogs`).
2. Run UI drag-drop reorder with concurrent users and confirm latest version increments correctly.
3. Monitor audit trail growth and archive policy (recommended for high-write tenants).
4. Add dashboard metrics for table changes per tenant and failed validations.

## 9. Changed files (implementation map)

Backend (`MuonroiBuildingBlock`):

- `src/Muonroi.RuleEngine.DecisionTable/ServiceCollectionExtensions.cs`
- `src/Muonroi.RuleEngine.DecisionTable/DecisionTableEngineOptions.cs`
- `src/Muonroi.RuleEngine.DecisionTable/Stores/IDecisionTableStore.cs`
- `src/Muonroi.RuleEngine.DecisionTable/Stores/InMemoryDecisionTableStore.cs`
- `src/Muonroi.RuleEngine.DecisionTable/Stores/EfCoreDecisionTableStore.cs`
- `src/Muonroi.RuleEngine.DecisionTable/Stores/Persistence/DecisionTableDbContext.cs`
- `src/Muonroi.RuleEngine.DecisionTable/Stores/Persistence/DecisionTableDatabaseMigrator.cs`
- `src/Muonroi.RuleEngine.DecisionTable.Web/Controllers/DecisionTableController.cs`
- `src/Muonroi.RuleEngine.DecisionTable.Web/ViewModels/DecisionTableBulkRequests.cs`

UI (`Muonroi.Ui.Engine`):

- `packages/m-ui-engine-decision-table/src/contracts.ts`
- `packages/m-ui-engine-decision-table/src/http.ts`
- `packages/m-ui-engine-decision-table/src/editor-model.ts`
- `packages/m-ui-engine-decision-table/src/react.ts`
- `packages/m-ui-engine-decision-table/src/primeng.ts`
- `packages/m-ui-engine-decision-table/tests/editor-model.spec.ts`
