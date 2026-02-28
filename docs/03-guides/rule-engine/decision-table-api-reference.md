# Decision Table API Reference

Namespace: `Muonroi.RuleEngine.DecisionTable.Web.Controllers`

Base route: `/api/v1/decision-tables`

## DecisionTableController

- `GET /api/v1/decision-tables`
  - List tables.
- `GET /api/v1/decision-tables/{id}`
  - Get table detail.
- `POST /api/v1/decision-tables`
  - Create a table.
- `PUT /api/v1/decision-tables/{id}`
  - Update a table.
- `DELETE /api/v1/decision-tables/{id}`
  - Delete a table.

## DecisionTableValidationController

- `POST /api/v1/decision-tables/{id}/validate`
  - Returns `ValidationResultViewModel`.
  - Includes `isValid`, `errors[]`, `warnings[]`.

## DecisionTableExportController

Base route: `/api/v1/decision-tables/{id}/export`

- `POST /json`
  - Returns generated workflow JSON (`application/json`).
- `POST /dmn`
  - Returns DMN XML (`application/xml`).

## Status codes

- `200 OK`: successful read/export/validate.
- `201 Created`: successful create.
- `204 NoContent`: successful delete.
- `400 BadRequest`: invalid payload/validation failed.
- `404 NotFound`: table not found.

## Store interface

`IDecisionTableStore` contract:

- `GetAllAsync(page, pageSize, ct)`
- `GetByIdAsync(id, ct)`
- `SaveAsync(table, ct)`
- `DeleteAsync(id, ct)`
