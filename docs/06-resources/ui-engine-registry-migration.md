# UI Engine Registry Migration

This migration replaces local mirrored UI workspace packages in `muonroi-control-plane/packages/*` with registry dependencies.

## What changed

- Dashboard dependencies moved from `workspace:*` to versioned packages (`^0.1.0`).
- `pnpm-workspace.yaml` now includes only `apps/*`.
- Root workspace no longer declares `packages/*`.
- Mirror folder `packages/` was removed from `muonroi-control-plane`.
- `scripts/sync-ui-packages.mjs` was archived as `sync-ui-packages.mjs.deprecated`.

## Registry/auth setup

`muonroi-control-plane/.npmrc`:

```ini
@muonroi:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Export `GITHUB_TOKEN` before running install, or provide it in CI secrets.

## CI note

Control-plane CI must provide `GITHUB_TOKEN` so `pnpm install` can resolve private commercial packages under `@muonroi`.
