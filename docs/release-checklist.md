# Release Checklist

## Versioning
- Follow [SemVer](https://semver.org/) for version numbers.
- Update `CHANGELOG.md` with new release notes.

## Environment Matrix
| Environment | Registry | Notes |
|-------------|----------|-------|
| Dev         | GHCR     | Latest features |
| Staging     | ACR      | Pre-release testing |
| Prod        | ECR      | Stable release |

## Compatibility Matrix
| Component | Supported Versions |
|-----------|-------------------|
| Message Broker | RabbitMQ 3.x |
| Database | PostgreSQL 14+, SQL Server 2022 |

Ensure matrices are updated each release.
