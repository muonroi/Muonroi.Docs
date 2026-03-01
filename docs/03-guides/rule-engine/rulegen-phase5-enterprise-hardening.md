# RuleGen Phase 5: Enterprise Hardening

## Objective

Add traceability and operational readiness for enterprise pipelines.

## Delivered

- Tenant-aware generation metadata (`--tenant`).
- Audit metadata in generated headers:
  - generation timestamp
  - author
  - short git commit (when available)
- Parallel extraction mode for large source sets.
- Time-based execution summary for extraction runs.
- Integration test automation for runtime workflow:
  - merge compile-check rollback
  - class targeting behavior
  - split export integrity

## Enterprise Command Pattern

```bash
muonroi-rule extract \
  --project ./src/MyService/MyService.csproj \
  --output ./src/MyService/Generated/Rules \
  --tenant acme-corp \
  --parallel true \
  --validate true
```

## CI Recommendation

1. `extract` in build pipeline.
2. `verify` as a guard check.
3. `register` to regenerate DI extension.
4. Fail pipeline on validation errors.
5. Run `tests/Muonroi.RuleGen.Tests` in CI to guard merge/split behaviors.
6. Keep generated files in source control for review/audit.
