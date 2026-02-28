# Muonroi Building Block Documentation

Welcome to the official documentation for Muonroi Building Block. This guide is organized into logical sections to help you find what you need quickly.

## 🚀 Getting Started
*   [**Introduction**](introduction.md) - Overview of the library's purpose and architecture.
*   [**Quickstart Guide**](getting-started.md) - How to install and set up your first project.
*   [**Template Quickstart**](template-quickstart.md) - Using the `dotnet new` template to scaffold a solution.
*   [**Appsettings Guide**](appsettings-guide.md) - Detailed configuration reference (Database, Token, Logger, etc.).

## 🔐 Authentication & Authorization
*   [**Auth Module Guide**](auth-module-guide.md) - Configuring JWT, Cookie Auth, and Middleware.
*   [**Token Guide**](token-guide.md) - Deep dive into Token generation, Refresh Tokens, and Validation.
*   [**Permission System**](permission-guide.md) - How RBAC and Permissions work (`[AuthorizePermission]`).
*   [**Permission Tree**](permission-tree-guide.md) - Syncing permissions to the frontend.
*   [**External Auth**](external-auth-guide.md) - Integrating third-party providers.
*   [**Multi-Tenant Guide**](multi-tenant-guide.md) - Configuring data isolation and tenant resolution.

## 🛠️ Backend Development
*   [**Backend Architecture**](backend-guide.md) - Best practices for Controllers, Handlers, and Repositories.
*   [**Data Layer Guide**](data-layer.md) - Using `MRepository`, `MQuery`, and Unit of Work.
*   [**Auto-CRUD API**](backend-guide.md#6-auto-crud-api-zero-code) - Generating APIs automatically from Entities.
*   [**Cache Guide**](cache-guide.md) - Configuring Multi-level Caching (Memory + Redis).
*   [**Background Jobs**](background-jobs-guide.md) - Setting up Hangfire or Quartz.
*   [**gRPC Guide**](grpc-guide.md) - Building high-performance RPC services.
*   [**SignalR Guide**](signalr-guide.md) - Real-time communication setup.

## ⚙️ Rule Engine
*   [**Rule Engine Guide**](rule-engine-guide.md) - Core concepts: `IRule<T>`, Workflows, and Facts.
*   [**Rule Governance**](rule-governance-guide.md) - Versioning, signing, and managing rule sets.
*   [**Rule Rollout**](rule-rollout-guide.md) - Feature flags and gradual rollout strategies.
*   [**Rule Testing Guide**](rule-engine-testing-guide.md) - Unit/integration/contract testing patterns.
*   [**External Services in Rules**](rule-engine-external-services.md) - REST/gRPC integration and resilience patterns.
*   [**Hooks Guide**](rule-engine-hooks-guide.md) - Logging/audit/error/performance hook patterns.
*   [**Configuration Reference**](rule-engine-configuration-reference.md) - Runtime/store configuration options.
*   [**Dependencies Guide**](rule-engine-dependencies.md) - Dependency ordering and cycle prevention.
*   [**Advanced Patterns**](rule-engine-advanced-patterns.md) - Hybrid/shadow rollout and code-first extraction.
*   [**NRules Integration**](nrules-integration.md) - Advanced rule patterns using NRules.

## 🌐 DevOps & Infrastructure
*   [**Observability**](observability-guide.md) - Logging (Serilog/Elastic), Metrics, and Tracing.
*   [**Gateway Configuration**](gateway-guide.md) - Setting up API Gateways (Ocelot/YARP).
*   [**Docker & Kubernetes**](ci-cd-docker-k8s.md) - Containerization and deployment checklists.
*   [**Secret Management**](secret-management.md) - Handling sensitive configuration securely.
*   [**ASVS Checklist**](asvs-checklist.md) - Security compliance verification.

## 🏢 Enterprise (Private)
*   [**License Capability Model**](enterprise/license-capability-model.md) - Tier matrix for Free/Paid/Enterprise.
*   [**Control Plane MVP**](enterprise/control-plane-mvp.md) - Centralized control plane design.
*   [**Enterprise Secure Profile (E2)**](enterprise/enterprise-secure-profile-e2.md) - Security hardening profile.
*   [**Enterprise Centralized Authorization (E3)**](enterprise/enterprise-centralized-authorization-e3.md) - Policy decision integration.
*   [**Enterprise Compliance (E4)**](enterprise/enterprise-compliance-e4.md) - Audit and compliance workflows.
*   [**Enterprise Operations (E5)**](enterprise/enterprise-operations-e5.md) - SLOs, ops gates, and runbooks.

## 📦 Samples
*   [**Base Template Examples**](base-template-examples.md) - Common patterns in the boilerplate.

---
*Cannot find what you are looking for? Check the [Database Structure](database-structure.md) or open an issue on GitHub.*
