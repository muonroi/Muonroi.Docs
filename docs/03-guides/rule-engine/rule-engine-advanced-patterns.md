# Rule Engine Advanced Patterns

## 1. Hybrid rollout

Use `RuleExecutionMode.Hybrid` to route part of traffic to traditional code and part to rules.

## 2. Shadow evaluation

Use `RuleExecutionMode.Shadow` to run rules in background and compare outputs before hard switch.

## 3. Feature-flagged activation

Combine `IRuleActivationStrategy<T>` with tenant/user flags for progressive enablement.

## 4. Runtime cache + invalidation

When using external JSON rulesets:

- cache active ruleset for low latency;
- invalidate locally and across nodes on save/activate events.

## 5. Code-first extraction workflow

1. Mark methods with `[ExtractAsRule(...)]`.
2. Generate rule classes using `muonroi-rule extract`.
3. Generate DI registration using `muonroi-rule register`.
4. Verify generated artifacts using `muonroi-rule verify`.
