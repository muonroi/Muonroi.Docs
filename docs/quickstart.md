# Quick Start

Use the helper script to scaffold a new WebAPI project preconfigured with Muonroi.BuildingBlock.

```bash
./scripts/setup-new-project.sh MyService
```

This will create a new folder `MyService` containing a sample `Program.cs` and `appsettings.json` already referencing the library.

Alternatively, install the `muonroibase.template` and generate the project via `dotnet new`:

```bash
dotnet new install muonroibase.template
dotnet new muonroibase -n MyService
```

## Next

- Configure your API: see [Getting Started](getting-started.md)
- Connect UI and manage roles/permissions: [UI Auth Admin Dashboard](ui-admin-dashboard.md)
