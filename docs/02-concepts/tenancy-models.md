# Tenancy Models

This building block targets SaaS scenarios where a single deployment serves multiple customers. We evaluated three common patterns and selected **shared database, shared schema** as the default approach.

## Shared Database, Shared Schema

Each tenant's rows sit in the same tables and are distinguished by a `tenant_id` column.

**Advantages**

- Lowest cost and simplest to operate.
- Straightforward to onboard new tenants.
- One schema to update, easing continuous delivery.

**Disadvantages**

- Bugs or missing filters can leak data across tenants.
- Noisy neighbors share resources and may impact each other.
- Requires a tenant column on every table and tenant-aware queries.

This is the **chosen model**. To add defense in depth, enable row-level security so the database enforces tenant boundaries even if a query omits filters.

## Shared Database, Schema per Tenant

Tenants share a database server but each gets its own schema.

**Advantages**

- Better isolation than a shared schema.
- Easier to drop or back up a single tenant.
- Allows tenant-specific schema customizations.

**Disadvantages**

- Many schemas to manage and migrate.
- Still share the same database instance and resources.
- Cross-tenant queries require unioning across schemas.

## Database per Tenant

Every tenant receives its own database instance.

**Advantages**

- Strongest isolation and blast-radius reduction.
- Tenants can scale, back up, or upgrade independently.
- Easier to satisfy data residency or compliance requirements.

**Disadvantages**

- Highest operational cost and complexity.
- Provisioning and migrations must run separately for each tenant.
- Harder to aggregate cross-tenant analytics.

## Row-Level Security Setup

When using the shared database model, enable Row-Level Security (RLS) in the database.

### PostgreSQL

```sql
ALTER TABLE public.app_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON public.app_data
    USING (tenant_id = current_setting('app.current_tenant')::uuid);
```
Set the `app.current_tenant` parameter on each connection.

### SQL Server

```sql
CREATE FUNCTION dbo.fn_tenant_access(@tenant_id UNIQUEIDENTIFIER)
RETURNS TABLE WITH SCHEMABINDING AS
    RETURN SELECT 1 AS fn_result
    WHERE @tenant_id = CAST(SESSION_CONTEXT(N'tenant_id') AS UNIQUEIDENTIFIER);
GO
CREATE SECURITY POLICY dbo.TenantIsolationPolicy
ADD FILTER PREDICATE dbo.fn_tenant_access(tenant_id) ON dbo.AppData
WITH (STATE = ON);
GO
```
Set `SESSION_CONTEXT('tenant_id')` for each connection before executing queries.

References: [Azure SaaS tenancy patterns](https://learn.microsoft.com/azure/architecture/guide/multitenant/considerations/saas-tenancy-models), [Postgres RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [SQL Server RLS](https://learn.microsoft.com/sql/relational-databases/security/row-level-security).
