# RuleGen Phase 2: Multi-File, DI, Validation

## Objective

Make extraction scalable for real projects and safer before generation.

## Delivered

- Multi-source discovery:
  - `--source <file|dir>`
  - `--source-dir <dir>`
  - `--project <*.csproj>`
- Glob control:
  - `--pattern` include pattern
  - `--exclude` for excludes
  - defaults exclude `bin/`, `obj/`, `*.g.cs`, `*.Generated.cs`
- DI-aware generation:
  - detect class fields referenced in extracted method
  - generate constructor injection + dependency metadata
- Validation pipeline:
  - duplicate rule code detection
  - invalid `HookPoint` detection
  - missing dependency warning
  - circular dependency detection

## Usage

```bash
muonroi-rule extract \
  --project ./src/MyService/MyService.csproj \
  --output ./src/MyService/Generated/Rules \
  --pattern "**/*Handler.cs" \
  --exclude "**/Legacy/**;**/Migrations/**"
```

## Verify

```bash
muonroi-rule verify \
  --project ./src/MyService/MyService.csproj \
  --rules ./src/MyService/Generated/Rules
```
