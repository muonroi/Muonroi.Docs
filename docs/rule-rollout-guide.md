# Rule Rollout Guide

This guide outlines a rollout strategy for JSON and code‑based rules.
Feature flags are evaluated through the `IRuleActivationStrategy<T>` hook so
each rule can be enabled for selected tenants or user groups.

## Feature flags and kill switch

- Connect `IRuleActivationStrategy<T>` to a feature‑flag provider such as
  [Unleash](https://www.getunleash.io/) to toggle rules at runtime.
- Use flags as a kill switch to disable a rule globally or target specific
  users, tenants or segments for gradual rollout.
- Example: implement `IRuleActivationStrategy<T>` that queries Unleash for a
  given rule code and context.

## Canary or progressive rollout

Use `PercentageRuleActivationStrategy<T>` to gradually enable new rules.
Supply a delegate that returns 10–20 for targeted tenants to send only a
fraction of transactions through the rule. Monitor the failure rate of each
rule and increase the percentage as confidence grows.

### Argo Rollouts

When rules are packaged with your service, [Argo Rollouts](https://argo-rollouts.readthedocs.io/)
can run the old and new versions side by side. Traffic is shifted to the
new version in steps and automatically rolled back if an error budget is
exceeded.

## Shadow evaluation / Dry‑run

Execute the new rule set in "shadow" mode to compare outputs with the active
version before exposing it to users. Only the existing rule affects state
while the shadow run logs differences for analysis.

## Runbook

### Enable or disable a rule
1. Update the activation strategy or feature flag configuration.
2. Redeploy the service to apply the change.

### Roll back a JSON ruleset
1. Restore the previous JSON workflow definition.
2. Redeploy or reload the ruleset to return to the last known good state.
