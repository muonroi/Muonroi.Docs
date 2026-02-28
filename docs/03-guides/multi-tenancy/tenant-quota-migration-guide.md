# Tenant Quota Migration Guide

This guide helps migrate existing tenants to the new quota subsystem.

## 1. Preconditions

- Upgrade application package to the version containing:
  - `ITenantQuotaTracker`
  - `TenantQuotaTracker`
  - `TenantQuotaController`
  - `QuotaEnforcementMiddleware`

## 2. Migration steps

1. Deploy application with quota services enabled.
2. Seed baseline limits for all active tenants.
3. Map old plans to new presets:
   - Legacy Free -> `TenantQuotaPresets.Free`
   - Legacy Pro -> `TenantQuotaPresets.Professional`
   - Legacy Enterprise -> `TenantQuotaPresets.Enterprise`
4. Run smoke tests:
   - below-limit request -> success
   - above-limit request -> `429` or `QuotaExceededException`
5. Enable alerts for near-limit thresholds.

## 3. Data migration checklist

- Ensure each tenant has a quota record.
- Backfill tier field for reporting.
- Verify default values for new quota keys.

## 4. Rollout strategy

- Start with monitor-only mode in staging.
- Enable middleware enforcement per environment.
- Roll out production in tenant batches.

## 5. Rollback

- Disable quota middleware in pipeline.
- Keep tracker/store data for later re-enable.
