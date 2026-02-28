# Tenant Disaster Recovery Playbook

This guide describes how to configure backups and perform restores in a database-per-tenant setup using Azure SQL.

## Enable Point-in-Time Restore (PITR)

1. For each tenant database, open the **Backups** blade in the Azure portal.
2. Ensure that Point-in-Time Restore is enabled and configure the retention window according to the tenant SLA (default is 7 days, up to 35).
3. Repeat for every new tenant database so each one has PITR coverage.

## Enable Long-Term Retention (LTR)

1. In the Azure portal, navigate to **Backup center** or the database's **Long-term retention** settings.
2. Create a retention policy (weekly, monthly, or yearly) that meets compliance requirements.
3. Apply the policy to each tenant database so long-term backups are captured automatically.
4. Verify backups appear in **Backup center**.

## Restore a Tenant

1. Locate the tenant database in the portal and choose **Restore**.
2. Select a point in time for PITR or pick an LTR backup.
3. Restore to a new database (for example, `<tenant>-restore-<date>`).
4. Update the tenant's connection string or migrate data as needed.

## Disaster Recovery Scenario

1. If the primary region is unavailable, create a new SQL server in the secondary region if required.
2. Restore the latest backup (PITR or LTR) to the secondary region.
3. Update application configuration to point tenants to the restored database.
4. Validate functionality and decommission old resources when the primary region recovers.

## Documentation

Maintain a runbook for each tenant that includes database name, server, retention policies, and restore steps. Periodically test restores to ensure recovery objectives are met.

