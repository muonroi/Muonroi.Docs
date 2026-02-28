# Troubleshooting Guide

Common operational issues for Rule Engine deployments.

## 1. Helm install fails with dependency error

Symptom:

- `missing in charts/ directory: postgresql, redis`

Fix:

```bash
helm dependency build ./k8s/helm/muonroi-rule-engine
```

## 2. Pods restart with DB connection error

Checks:

- verify `database-connection-string` secret value
- verify Postgres service DNS and namespace
- inspect container logs:

```bash
kubectl logs deploy/<release>-muonroi-rule-engine -n <ns>
```

## 3. 429 responses for all tenant requests

Possible causes:

- tenant mapped to low tier quota
- stale counters from previous burst

Fix:

- inspect `/api/v1/tenants/{tenantId}/quotas/usage`
- inspect `/api/v1/tenants/{tenantId}/quotas/limits`
- upgrade tier or adjust limits

## 4. Rule execution blocked by quota

Symptom:

- `QuotaExceededException` from orchestrator

Fix:

- check `ConcurrentExecutions`, `RuleEvaluationsPerSecond`, `RuleExecutionsPerDay`
- reduce parallel load or increase tenant limits

## 5. ServiceMonitor not scraping

Checks:

- CRD `monitoring.coreos.com/v1` exists
- `monitoring.enabled=true`
- `monitoring.serviceMonitor.enabled=true`
- label selectors match service labels

## 6. Ingress unreachable

Checks:

- ingress class matches controller
- DNS points to ingress load balancer
- TLS secret exists
- path rules map to service port

## 7. FEEL expression returns null unexpectedly

Checks:

- validate expression syntax in tests
- inspect variable names and casing
- ensure function names use FEEL aliases (`string length`, `date and time`, etc.)

## 8. Decision table export mismatch

Checks:

- run decision table validation before export
- ensure input/output column counts match row cells
- verify hit policy and row order
