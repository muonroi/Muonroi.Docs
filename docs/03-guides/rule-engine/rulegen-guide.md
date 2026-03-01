# RuleGen Upgrade Guide (Unified Plan)

This guide tracks the full `Muonroi.RuleGen` upgrade implementation from the merged plan in:

- `tools/Muonroi.RuleGen/UPGRADE_PLAN_V2.md`
- `tools/Muonroi.RuleGen/toolkit_upgrade.md`

Unified plan source:
- `tools/Muonroi.RuleGen/UNIFIED_UPGRADE_PLAN.md`

## Implemented Scope

1. Phase 1: Roslyn foundation and method-body extraction.
2. Phase 2: multi-file/project extraction, DI-aware generation, validation.
3. Phase 3: config-first DX, watch mode, test scaffold generation.
4. Phase 4: runtime JSON merge/split workflow.
5. Phase 5: enterprise hardening (tenant metadata, audit metadata, performance-oriented parallel extraction).

## New CLI Commands

```bash
muonroi-rule extract ...
muonroi-rule verify ...
muonroi-rule register ...
muonroi-rule generate-tests ...
muonroi-rule merge ...
muonroi-rule split ...
muonroi-rule watch ...
```

## Recommended Rollout

1. Enable `extract + verify + register` in CI.
2. Adopt `.rulegenrc.json` in each service.
3. Add `merge/split` flow for BA/QC handoff with `--class` targeting.
4. Track generated artifacts with git + review policy.
5. Keep `merge --compile-check true` enabled (default) and provide `--compile-target` in CI for deterministic rollback safety.

## Known Boundaries

- FEEL <-> C# translation is best-effort for simple/medium expressions.
- Complex imperative C# (loops/LINQ/external IO-heavy branches) is marked as custom logic and requires manual review.
