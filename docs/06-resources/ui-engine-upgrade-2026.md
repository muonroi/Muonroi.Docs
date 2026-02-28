# UI Engine Full Upgrade (2026)

This document summarizes the completed full upgrade for `Muonroi.Ui.Engine` and backend contracts in `MuonroiBuildingBlock`.

## Scope Completed

- Auto-sync API foundation
  - Added `GET /api/v1/auth/ui-engine/schema-hash`
  - Added `POST /api/v1/auth/ui-engine/notify-change`
  - Added frontend polling watcher (`MUiEngineWatchService`)
  - Added realtime watcher abstraction (`MUiEngineRealtimeWatcher`)
- Tier-based feature gating
  - Extended manifest with `licenseTier` and `capabilities`
  - Added `requiredCapability` metadata on screens/components/actions
  - Added backend capability composition by tenant tier
  - Added frontend resolver (`MUiEngineCapabilityResolver`) and adapter (`MTierAwareRenderAdapter`)
- Template binding system
  - New package: `@muonroi/ui-engine-template`
  - `MUiTemplateConfig` schema + validation
  - `MUiEngineTemplateBinder` to generate:
    - models
    - services
    - routes
    - menu
    - component registry
  - New CLI:
    - `mui-template init`
    - `mui-template bind`
- Backend realtime support
  - Added SignalR hub `MUiEngineHub`
  - Added schema-change notifier service

## Backend Contract Additions

`MUiEngineManifest` now includes:

- `licenseTier`
- `capabilities[]`

New backend models:

- `MUiEngineCapability`
- `MUiEngineSchemaVersion`
- `MUiEngineSchemaChangeNotification`

## Recommended Runtime Flow

1. Load manifest from `GET /api/v1/auth/ui-engine/current`.
2. Resolve tier/capability behavior from manifest metadata.
3. Start `MUiEngineWatchService` (polling) for schema hash changes.
4. Start `MUiEngineRealtimeWatcher` when SignalR is enabled.
5. Rebind/generate project files using `@muonroi/ui-engine-template` in development or CI.

## CLI Example

```bash
mui-template init \
  --framework angular \
  --ui-kit primeng \
  --template freya \
  --output ./my-admin-app

mui-template bind \
  --config ./my-admin-app/ui-engine-template.json \
  --manifest http://localhost:5000/api/v1/auth/ui-engine/current
```

## Validation and Test Status

- TypeScript workspace: `npm run test`, `npm run build`
- UI Engine MVC tests: `dotnet test Muonroi.Ui.Engine.sln`
- Backend targeted tests (UI engine service/controller): passed
