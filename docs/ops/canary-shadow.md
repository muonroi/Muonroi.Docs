# Canary & Shadow Rule Evaluation

Feature flags allow gradual roll-out of new rule sets per tenant or segment using providers like **Unleash** or **OpenFeature**. `FeatureFlagEvaluator` reads the flag and decides which rule set should handle a request.

## Shadow Evaluation

When a flag is disabled, the evaluator executes the new rule set in shadow mode and logs any differences with the current production result. This enables safe comparison before turning the flag on.

## Canary Rollouts

Use [Argo Rollouts](https://argoproj.github.io/argo-rollouts/) to progressively shift traffic to the new rule-service version. The manifest in `k8s/rollouts.yaml` increments traffic weight in steps and references a Prometheus analysis template that checks the error budget and triggers automatic rollback on breach.
