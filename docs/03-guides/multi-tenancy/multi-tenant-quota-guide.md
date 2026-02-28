# Multi-Tenant Quota Guide

This guide explains quota setup for rule engine workloads.

## 1. What is enforced

Supported quota keys (from `QuotaType`):

- `RuleExecutionsPerDay`
- `ConcurrentExecutions`
- `ApiRequestsPerMinute`
- `RuleEvaluationsPerSecond`
- `WorkflowExecutionsPerHour`
- `StorageUsageMB`
- `TotalRules`
- `TotalDecisionTables`
- `TotalWorkflows`

## 2. Registration

`InfrastructureExtensions` already wires quota services:

- `AddTenantQuotaManagement()`
- `UseQuotaEnforcement()`

## 3. Runtime behavior

- Middleware checks `ApiRequestsPerMinute`.
- `RuleOrchestrator<TContext>` checks and updates:
  - `ConcurrentExecutions`
  - `RuleEvaluationsPerSecond`
  - `RuleExecutionsPerDay`
- On violation, `QuotaExceededException` is thrown or API returns `429`.

## 4. Tiers

Preset tiers in `TenantQuotaPresets`:

- `Free`
- `Starter`
- `Professional`
- `Enterprise`

## 5. Storage and tracker

- `ITenantQuotaStore` stores limits and usage.
- `TenantQuotaTracker` uses distributed cache for time-window counters.

## 6. Testing

See `tests/Muonroi.BuildingBlock.Test/Tenancy/TenantQuotaTests.cs` for baseline coverage.
