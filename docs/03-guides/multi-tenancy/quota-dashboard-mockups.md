# Quota Dashboard Mockups

This file provides wireframe-level mockups for tenant quota operations.

## 1. Tenant overview page

```text
+--------------------------------------------------------------+
| Tenant: acme-prod           Tier: Professional   [Upgrade]   |
+--------------------------------------------------------------+
| API/min        120 / 500      Rule eval/sec      40 / 200    |
| Rule/day       10,245 / 100k  Concurrent exec    6 / 20      |
| Workflows/hour 120 / 10,000   Storage MB         120 / 500   |
+--------------------------------------------------------------+
| Alerts:                                                       |
| - API usage reached 80% threshold                             |
+--------------------------------------------------------------+
```

## 2. Limits management page

```text
+--------------------------------------------------------------+
| Quota Limits (Admin)                                          |
+----------------------------+----------------------------------+
| Max API req/min            | [ 500 ]                          |
| Max rule eval/sec          | [ 200 ]                          |
| Max concurrent executions  | [ 20 ]                           |
| Max executions/day         | [ 100000 ]                       |
| Max workflows/hour         | [ 10000 ]                        |
| Max storage MB             | [ 500 ]                          |
+----------------------------+----------------------------------+
| [Reset to tier defaults] [Save]                               |
+--------------------------------------------------------------+
```

## 3. Upgrade flow

```text
Current: Starter

[ ] Free
[x] Starter
[ ] Professional
[ ] Enterprise

[Preview limits] [Apply upgrade]
```

## 4. Suggested metrics panels

- Usage percentage by quota key.
- Last 24h API request trend.
- Quota exceeded events by tenant.
- Top tenants by rule executions.
