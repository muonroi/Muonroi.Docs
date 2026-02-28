# Azure SQL Elastic Jobs for Tenant Migrations

Azure SQL Elastic Jobs allow us to run the same T-SQL script across a fleet of databases. This is useful for multi-tenant systems where each tenant has its own database.

## Setup

1. Create an Azure SQL Elastic Job agent database.
2. Register a SQL credential that has rights to all tenant databases.
3. Add tenant databases to a target group.

## Running migrations

Use the PowerShell script at `tools/tenants/migrate-tenants.ps1` to create a job and execute a migration script for every tenant database.

```powershell
pwsh ./tools/tenants/migrate-tenants.ps1 \`
    -ResourceGroupName <rg> \`
    -ServerName <sql-server> \`
    -AgentDatabase <agent-db> \`
    -CredentialName <credential> \`
    -ScriptPath ./migrate.sql \`
    -TenantDatabases @('tenant1','tenant2')
```

Run with `-WhatIf` to preview actions without executing them.

## Sample T-SQL script

```sql
-- migrate.sql
PRINT N'Starting migration';
-- Example schema change
ALTER TABLE Example ADD NewColumn INT NULL;
```

For more information, see the [Azure SQL Elastic Jobs overview](https://learn.microsoft.com/azure/azure-sql/database/elastic-jobs-overview) and the [Elastic Jobs tutorial](https://learn.microsoft.com/azure/azure-sql/database/elastic-jobs-overview#create-and-run-an-elastic-job).
