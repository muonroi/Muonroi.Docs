# Decision Table Guide

This guide explains how to design, validate, and execute decision tables with `Muonroi.RuleEngine.DecisionTable`.

## 1. Core workflow

1. Define table metadata and columns.
2. Add rows with FEEL-style expressions.
3. Validate structure and overlap/gap issues.
4. Export to JSON workflow or DMN XML.
5. Convert to typed `IRule<T>` and execute with `RuleOrchestrator<T>`.

## 2. Minimal example

```csharp
var table = new DecisionTable
{
    Name = "AgeApproval",
    HitPolicy = HitPolicy.First,
    InputColumns = [new DecisionTableColumn { Name = "Age", Label = "Age", DataType = "number" }],
    OutputColumns = [new DecisionTableColumn { Name = "CanApprove", Label = "CanApprove", DataType = "boolean" }],
    Rows =
    [
        new DecisionTableRow
        {
            Order = 1,
            InputCells = [new DecisionTableCell { Expression = ">= 18" }],
            OutputCells = [new DecisionTableCell { Expression = "true" }]
        },
        new DecisionTableRow
        {
            Order = 2,
            InputCells = [new DecisionTableCell { Expression = "< 18" }],
            OutputCells = [new DecisionTableCell { Expression = "false" }]
        }
    ]
};
```

## 3. Validation

```csharp
var validator = new DecisionTableValidator();
var result = validator.Validate(table);
if (!result.IsValid)
{
    // result.Errors: structure/overlap issues
}
// result.Warnings: gap hints
```

## 4. Export

```csharp
var workflowJson = new DecisionTableToJsonConverter().Convert(table);
var dmnXml = new DecisionTableXmlSerializer().SerializeToDmnXml(table);
```

## 5. CLI usage

```bash
muonroi-dt import-excel --source ./input.xlsx --output ./table.json
muonroi-dt validate --source ./table.json
muonroi-dt export-json --source ./table.json --output ./workflow.json
muonroi-dt export-dmn --source ./table.json --output ./workflow.dmn.xml
```

## 6. Related sample

See `MuonroiBuildingBlock/Samples/DecisionTableDemo` for runnable code.

Sample index:

- [Rule Engine Samples](../../06-resources/rule-engine-samples.md)
