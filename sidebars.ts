import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'getting-started/introduction',
        'getting-started/getting-started',
        'getting-started/quickstart',
        'getting-started/template-quickstart',
        'getting-started/quickstart-multi-tenant-api',
      ],
    },
    {
      type: 'category',
      label: '🧩 Concepts',
      items: [
        'concepts/architecture-overview',
        'concepts/tenancy-models',
        'concepts/ef-filters',
      ],
    },
    {
      type: 'category',
      label: '🛠️ How-to Guides',
      items: [
        {
          type: 'category',
          label: '👤 Identity & Access',
          items: [
            'guides/identity-access/permission-guide',
            'guides/identity-access/permission-tree-guide',
            'guides/identity-access/external-auth-guide',
            'guides/identity-access/auth-module-guide',
            'guides/identity-access/bff',
            'guides/identity-access/mfa',
            'guides/identity-access/oauth2-oidc',
            'guides/identity-access/token-guide',
          ],
        },
        {
          type: 'category',
          label: '🧠 Rule Engine',
          items: [
            'guides/rule-engine/rule-engine-guide',
            'guides/rule-engine/decision-table-guide',
            'guides/rule-engine/decision-table-api-reference',
            'guides/rule-engine/feel-reference',
            'guides/rule-engine/feel-migration-guide',
            'guides/rule-engine/rule-governance-guide',
            'guides/rule-engine/rule-rollout-guide',
            'guides/rule-engine/rule-engine-testing-guide',
            'guides/rule-engine/rule-engine-external-services',
            'guides/rule-engine/rule-engine-hooks-guide',
            'guides/rule-engine/rule-engine-configuration-reference',
            'guides/rule-engine/rule-engine-dependencies',
            'guides/rule-engine/rule-engine-advanced-patterns',
            'guides/rule-engine/nrules-integration',
          ],
        },
        {
          type: 'category',
          label: '🏢 Multi-Tenancy',
          items: [
            'guides/multi-tenancy/multi-tenant-guide',
            'guides/multi-tenancy/tenant-isolation',
            'guides/multi-tenancy/multi-tenant-quota-guide',
            'guides/multi-tenancy/quota-api-reference',
            'guides/multi-tenancy/quota-dashboard-mockups',
            'guides/multi-tenancy/tenant-quota-migration-guide',
          ],
        },
        {
          type: 'category',
          label: '🔗 Integration',
          items: [
            'guides/integration/backend-guide',
            'guides/integration/gateway-guide',
            'guides/integration/grpc-guide',
            'guides/integration/signalr-guide',
            'guides/integration/dapper-guide',
            'guides/integration/cache-guide',
            'guides/integration/opa-integration-guide',
            'guides/integration/data-layer',
            'guides/integration/saga-kafka',
          ],
        },
        {
          type: 'category',
          label: '💎 Enterprise',
          items: [
            'guides/enterprise/license-capability-model',
            'guides/enterprise/control-plane-mvp',
            'guides/enterprise/enterprise-secure-profile-e2',
            'guides/enterprise/enterprise-centralized-authorization-e3',
            'guides/enterprise/enterprise-compliance-e4',
            'guides/enterprise/enterprise-operations-e5',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '⚙️ Operations',
      items: [
        'operations/background-jobs-guide',
        'operations/observability-guide',
        'operations/performance-guide',
        'operations/secret-management',
        'operations/ci-cd-docker-k8s',
        'operations/canary-shadow',
        'operations/dr-tenant-playbook',
        'operations/elastic-jobs',
        'operations/kubernetes-deployment-guide',
        'operations/troubleshooting-guide',
      ],
    },
    {
      type: 'category',
      label: '📖 Reference',
      items: [
        'reference/appsettings-guide',
        'reference/database-structure',
        'reference/interface-guide',
        'reference/timing-guide',
      ],
    },
    {
      type: 'category',
      label: '📚 Resources',
      items: [
        'resources/usage-guide',
        'resources/feature-flags',
        'resources/muonroibase-template',
        'resources/base-template-examples',
        'resources/rule-engine-samples',
        'resources/asvs-checklist',
        'resources/release-checklist',
        'resources/upgrade-guide',
        'resources/test-matrix-guide',
        'resources/buildingblock/index',
      ],
    },
  ],
};

export default sidebars;
