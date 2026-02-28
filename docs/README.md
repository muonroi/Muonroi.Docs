# Muonroi Building Block Documentation

Welcome to the official documentation for Muonroi Building Block. This guide is organized into logical sections to help you find what you need quickly.

## 🚀 Getting Started
*   [**Introduction**](01-getting-started/introduction.md) - Overview of the library's purpose and architecture.
*   [**Quickstart Guide**](01-getting-started/getting-started.md) - How to install and set up your first project.
*   [**Template Quickstart**](01-getting-started/template-quickstart.md) - Using the `dotnet new` template to scaffold a solution.
*   [**Appsettings Guide**](05-reference/appsettings-guide.md) - Detailed configuration reference (Database, Token, Logger, etc.).

## 🔐 Authentication & Authorization
*   [**Auth Module Guide**](03-guides/identity-access/auth-module-guide.md) - Configuring JWT, Cookie Auth, and Middleware.
*   [**Token Guide**](03-guides/identity-access/token-guide.md) - Deep dive into Token generation, Refresh Tokens, and Validation.
*   [**Permission System**](03-guides/identity-access/permission-guide.md) - How RBAC and Permissions work (`[AuthorizePermission]`).
*   [**Permission Tree**](03-guides/identity-access/permission-tree-guide.md) - Syncing permissions to the frontend.
*   [**External Auth**](03-guides/identity-access/external-auth-guide.md) - Integrating third-party providers.
*   [**Multi-Tenant Guide**](03-guides/multi-tenancy/multi-tenant-guide.md) - Configuring data isolation and tenant resolution.
*   [**Multi-Tenant Quota Guide**](03-guides/multi-tenancy/multi-tenant-quota-guide.md) - Cấu hình quota theo tenant/tier.
*   [**Quota API Reference**](03-guides/multi-tenancy/quota-api-reference.md) - API usage/limits/upgrade tier.
*   [**Quota Dashboard Mockups**](03-guides/multi-tenancy/quota-dashboard-mockups.md) - Wireframe dashboard giám sát quota.
*   [**Tenant Quota Migration Guide**](03-guides/multi-tenancy/tenant-quota-migration-guide.md) - Kế hoạch migration tenant cũ.

## 🛠️ Backend Development
*   [**Backend Architecture**](03-guides/integration/backend-guide.md) - Best practices for Controllers, Handlers, and Repositories.
*   [**Data Layer Guide**](03-guides/integration/data-layer.md) - Using `MRepository`, `MQuery`, and Unit of Work.
*   [**Cache Guide**](03-guides/integration/cache-guide.md) - Configuring Multi-level Caching (Memory + Redis).
*   [**Background Jobs**](04-operations/background-jobs-guide.md) - Setting up Hangfire or Quartz.
*   [**gRPC Guide**](03-guides/integration/grpc-guide.md) - Building high-performance RPC services.
*   [**SignalR Guide**](03-guides/integration/signalr-guide.md) - Real-time communication setup.

## 🧠 Rule Engine
*   [**Rule Engine Guide**](03-guides/rule-engine/rule-engine-guide.md) - Core concepts: `IRule<T>`, Workflows, and Facts.
*   [**Decision Table Guide**](03-guides/rule-engine/decision-table-guide.md) - Thiết kế, validate, export và execute decision tables.
*   [**Decision Table API Reference**](03-guides/rule-engine/decision-table-api-reference.md) - Danh sách endpoint CRUD/validate/export.
*   [**FEEL Reference**](03-guides/rule-engine/feel-reference.md) - Cú pháp FEEL, function, range, context, quantified expressions.
*   [**FEEL Migration Guide**](03-guides/rule-engine/feel-migration-guide.md) - Nâng cấp từ FEEL v1 lên v2 mở rộng.
*   [**Rule Engine Upgrade (Tiếng Việt)**](03-guides/rule-engine/rule-engine-upgrade-guide.vi.md) - Hướng dẫn nâng cấp, runtime modes, loại rule, và kịch bản verify.
*   [**Rule Governance**](03-guides/rule-engine/rule-governance-guide.md) - Versioning, signing, and managing rule sets.
*   [**Rule Rollout**](03-guides/rule-engine/rule-rollout-guide.md) - Feature flags and gradual rollout strategies.
*   [**Rule Testing Guide**](03-guides/rule-engine/rule-engine-testing-guide.md) - Unit/integration/contract testing patterns.
*   [**External Services in Rules**](03-guides/rule-engine/rule-engine-external-services.md) - REST/gRPC integration and resilience patterns.
*   [**Hooks Guide**](03-guides/rule-engine/rule-engine-hooks-guide.md) - Logging/audit/error/performance hook patterns.
*   [**Configuration Reference**](03-guides/rule-engine/rule-engine-configuration-reference.md) - Runtime/store configuration options.
*   [**Dependencies Guide**](03-guides/rule-engine/rule-engine-dependencies.md) - Dependency ordering and cycle prevention.
*   [**Advanced Patterns**](03-guides/rule-engine/rule-engine-advanced-patterns.md) - Hybrid/shadow rollout and code-first extraction.
*   [**NRules Integration**](03-guides/rule-engine/nrules-integration.md) - Advanced rule patterns using NRules.

## 🌐 DevOps & Infrastructure
*   [**Observability**](04-operations/observability-guide.md) - Logging (Serilog/Elastic), Metrics, and Tracing.
*   [**Performance Guide**](04-operations/performance-guide.md) - Optimization and scaling strategies.
*   [**Gateway Configuration**](03-guides/integration/gateway-guide.md) - Setting up API Gateways (Ocelot/YARP).
*   [**Docker & Kubernetes**](04-operations/ci-cd-docker-k8s.md) - Containerization and deployment checklists.
*   [**Kubernetes Deployment Guide**](04-operations/kubernetes-deployment-guide.md) - Triển khai Helm chart cho Rule Engine.
*   [**Troubleshooting Guide**](04-operations/troubleshooting-guide.md) - Chẩn đoán sự cố vận hành thường gặp.
*   [**Secret Management**](04-operations/secret-management.md) - Handling sensitive configuration securely.
*   [**ASVS Checklist**](06-resources/asvs-checklist.md) - Security compliance verification.

## 🏢 Enterprise (Private)
*   [**License Capability Model**](03-guides/enterprise/license-capability-model.md) - Tier matrix for Free/Paid/Enterprise.
*   [**Control Plane MVP**](03-guides/enterprise/control-plane-mvp.md) - Centralized control plane design.
*   [**Enterprise Secure Profile (E2)**](03-guides/enterprise/enterprise-secure-profile-e2.md) - Security hardening profile.
*   [**Enterprise Centralized Authorization (E3)**](03-guides/enterprise/enterprise-centralized-authorization-e3.md) - Policy decision integration.
*   [**Enterprise Compliance (E4)**](03-guides/enterprise/enterprise-compliance-e4.md) - Audit and compliance workflows.
*   [**Enterprise Operations (E5)**](03-guides/enterprise/enterprise-operations-e5.md) - SLOs, ops gates, and runbooks.

## 📦 Samples
*   [**Base Template Examples**](06-resources/base-template-examples.md) - Common patterns in the boilerplate.
*   [**Rule Engine Samples**](06-resources/rule-engine-samples.md) - Chạy `DecisionTableDemo` và `FeelPlayground`.

## 🪞 BuildingBlock Mirror
*   [**Markdown Mirror Index**](06-resources/buildingblock/index.md) - Danh sách các file `*.md` đồng bộ từ `MuonroiBuildingBlock`.

---
*Cannot find what you are looking for? Check the [Database Structure](05-reference/database-structure.md) or open an issue on GitHub.*
