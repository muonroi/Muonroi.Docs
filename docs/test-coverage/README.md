# Test Coverage Summary

This folder stores the coverage statistics generated from the latest unit test run.

## Test command

```
dotnet test --collect:"XPlat Code Coverage" --results-directory TestResults
```

> **Note:** The .NET SDK emits a warning about the `XPlat Code Coverage` data collector, but coverage reports are still produced for each test project.

## Coverage summary

The file [`coverage-summary.csv`](./coverage-summary.csv) consolidates the line and branch coverage extracted from every `coverage.cobertura.xml` file emitted during the run.

| Metric | Value |
| --- | --- |
| Total lines covered | 6,936 |
| Total lines | 16,515 |
| Line coverage | 42.00% |
| Total branches covered | 1,852 |
| Total branches | 5,152 |
| Branch coverage | 35.95% |

Each row in the CSV maps to a specific test project's `coverage.cobertura.xml`, making it easier for reviewers to inspect coverage per test assembly.
