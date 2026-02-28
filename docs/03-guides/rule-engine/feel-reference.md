# FEEL Reference

This document summarizes FEEL support in `Muonroi.Rules.Feel.FeelEvaluator`.

## 1. Core operators

- Logical: `AND`, `OR`, `NOT`
- Arithmetic: `+`, `-`, `*`, `/`
- Comparison: `=`, `!=`, `>`, `>=`, `<`, `<=`
- Membership: `in`
- String operators: `contains`, `startsWith`

## 2. Expressions

- If/then/else:
  - `if score > 80 then "A" else "B"`
- For loop:
  - `for i in 1..5 return i * 2`
- Quantified:
  - `some x in [1,2,3] satisfies x > 2`
  - `every x in [1,2,3] satisfies x > 0`
- Filter:
  - `[1,2,3,4,5][item > 2]`
- Context:
  - `{x: 10, y: 20, sum: x + y}.sum`
- Between:
  - `10 between 1 and 20`
- Instance of:
  - `value instance of number`

## 3. Ranges

Supported range boundaries in `in`:

- Closed: `5 in [1..10]`
- Open/closed: `5 in (1..10]`
- Closed/open: `5 in [1..10)`
- Open: `5 in (1..10)`

## 4. Function definitions

Supported inline function form:

```feel
{ add: function(x, y) x + y, result: add(2, 3) }.result
```

Closure capture is supported:

```feel
{ base: 10, addBase: function(x) x + base, result: addBase(5) }.result
```

## 5. Built-in functions

Examples:

- Date/time: `today()`, `now()`, `date("2026-03-01")`, `time("14:30:00")`, `date and time(...)`
- Duration: `duration("P1D")`, `years and months duration(...)`, `days and time duration(...)`
- List: `list contains`, `count`, `min`, `max`, `sum`, `mean`, `append`, `union`, `distinct values`, `flatten`
- String: `string length`, `substring`, `replace`, `matches`, `split`, `upper case`, `lower case`
- Number: `decimal`, `floor`, `ceiling`, `abs`, `modulo`, `sqrt`, `log`, `exp`, `odd`, `even`
- Date helpers: `day of week`, `day of year`, `week of year`, `month of year`, `year`
- Context helpers: `get entries`, `get value`

## 6. Playground sample

Use `MuonroiBuildingBlock/Samples/FeelPlayground` to evaluate expressions manually.

Sample index:

- [Rule Engine Samples](../../06-resources/rule-engine-samples.md)
