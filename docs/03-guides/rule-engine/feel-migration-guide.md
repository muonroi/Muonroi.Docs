# FEEL Migration Guide (v1 -> v2)

This guide covers migration from initial FEEL support to expanded DMN-style support.

## 1. Backward compatibility

Existing expressions continue to work:

- legacy comparisons (`age >= 18`)
- logical operators
- simple list checks (`status in (ACTIVE,PENDING)`)

## 2. New capabilities

- Extended built-in function set.
- Context expressions and projections.
- Quantified expressions (`some`, `every`).
- Open/closed range support in `in`.
- Inline function definitions: `function(x, y) ...`.

## 3. Recommended migration path

1. Keep existing rules unchanged.
2. Add new FEEL expressions only in new rule versions.
3. Run rule tests using `tests/Rules/Feel`.
4. Roll out with feature-flag/canary strategy.

## 4. Validation checklist

- Verify each upgraded expression returns same result for old scenarios.
- Add negative-path tests for range boundaries.
- Add test cases for function body/closure behavior.
- Validate duration/date parsing for target locale inputs.

## 5. Known differences

- FEEL function support is expression-level and inline.
- External DMN TCK certification is not bundled by default in this repository pipeline.

## 6. Verify with samples

- Run `MuonroiBuildingBlock/Samples/FeelPlayground` for expression-level validation.
- Run `MuonroiBuildingBlock/Samples/DecisionTableDemo` for decision-table and orchestration flow.
- Sample index: [Rule Engine Samples](../../06-resources/rule-engine-samples.md)
