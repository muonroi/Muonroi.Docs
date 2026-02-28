# Kubernetes Deployment Guide

This guide covers production deployment of Muonroi Rule Engine via Helm chart:

- `k8s/helm/muonroi-rule-engine`

## 1. Prerequisites

- Kubernetes 1.28+
- Helm 3.12+ (Helm 4 compatible)
- Optional: Prometheus Operator for `ServiceMonitor`

## 2. Validate chart

```bash
helm lint ./k8s/helm/muonroi-rule-engine
helm dependency build ./k8s/helm/muonroi-rule-engine
helm template rule-engine ./k8s/helm/muonroi-rule-engine > rendered.yaml
```

## 3. Install

```bash
helm install rule-engine ./k8s/helm/muonroi-rule-engine \
  -n rule-engine \
  --create-namespace \
  -f ./k8s/helm/muonroi-rule-engine/values-production.yaml
```

## 4. Post-install checks

```bash
kubectl get pods -n rule-engine
kubectl rollout status deployment/rule-engine-muonroi-rule-engine -n rule-engine
kubectl get ingress -n rule-engine
kubectl get hpa -n rule-engine
```

Health check:

```bash
kubectl port-forward svc/rule-engine-muonroi-rule-engine 8080:80 -n rule-engine
curl http://localhost:8080/health/ready
```

## 5. Production recommendations

- Set `secrets.databaseConnectionString` and `secrets.redisPassword`.
- Use cert-manager TLS in ingress.
- Keep `podDisruptionBudget.enabled=true`.
- Enable autoscaling with conservative min/max.
- Enable NetworkPolicy in restricted clusters.
- Pin image tags per release.

## 6. Upgrade and rollback

```bash
helm upgrade rule-engine ./k8s/helm/muonroi-rule-engine \
  -n rule-engine \
  -f ./k8s/helm/muonroi-rule-engine/values-production.yaml

helm rollback rule-engine -n rule-engine
```

## 7. Monitoring

- Import dashboard:
  - `k8s/helm/muonroi-rule-engine/dashboards/rule-engine-dashboard.json`
- Confirm metrics endpoint `/metrics` is scraped.
