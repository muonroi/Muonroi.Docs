import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        '01-getting-started/introduction',
        '01-getting-started/getting-started',
        '01-getting-started/quickstart',
        '01-getting-started/template-quickstart',
        '01-getting-started/quickstart-multi-tenant-api',
      ],
    },
    {
      type: 'category',
      label: '🧩 Concepts',
      items: [
        '02-concepts/architecture-overview',
        '02-concepts/tenancy-models',
        '02-concepts/ef-filters',
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
            '03-guides/identity-access/permission-guide',
            '03-guides/identity-access/permission-tree-guide',
            '03-guides/identity-access/external-auth-guide',
            '03-guides/identity-access/auth-module-guide',
            '03-guides/identity-access/bff',
            '03-guides/identity-access/mfa',
            '03-guides/identity-access/oauth2-oidc',
            '03-guides/identity-access/token-guide',
          ],
        },
        {
          type: 'category',
          label: '🧠 Rule Engine',
          items: [
            '03-guides/rule-engine/rule-engine-guide',
            '03-guides/rule-engine/rule-governance-guide',
            '03-guides/rule-engine/rule-rollout-guide',
            '03-guides/rule-engine/rule-engine-testing-guide',
            '03-guides/rule-engine/rule-engine-external-services',
            '03-guides/rule-engine/rule-engine-hooks-guide',
            '03-guides/rule-engine/rule-engine-configuration-reference',
            '03-guides/rule-engine/rule-engine-dependencies',
            '03-guides/rule-engine/rule-engine-advanced-patterns',
            '03-guides/rule-engine/nrules-integration',
          ],
        },
        {
          type: 'category',
          label: '🏢 Multi-Tenancy',
          items: [
            '03-guides/multi-tenancy/multi-tenant-guide',
            '03-guides/multi-tenancy/tenant-isolation',
          ],
        },
        {
          type: 'category',
          label: '🔗 Integration',
          items: [
            '03-guides/integration/backend-guide',
            '03-guides/integration/gateway-guide',
            '03-guides/integration/grpc-guide',
            '03-guides/integration/signalr-guide',
            '03-guides/integration/dapper-guide',
            '03-guides/integration/cache-guide',
            '03-guides/integration/opa-integration-guide',
            '03-guides/integration/data-layer',
            '03-guides/integration/saga-kafka',
          ],
        },
        {
          type: 'category',
          label: '💎 Enterprise',
          items: [
            '03-guides/enterprise/license-capability-model',
            '03-guides/enterprise/control-plane-mvp',
            '03-guides/enterprise/enterprise-secure-profile-e2',
            '03-guides/enterprise/enterprise-centralized-authorization-e3',
            '03-guides/enterprise/enterprise-compliance-e4',
            '03-guides/enterprise/enterprise-operations-e5',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '⚙️ Operations',
      items: [
        '04-operations/background-jobs-guide',
        '04-operations/observability-guide',
        '04-operations/performance-guide',
        '04-operations/secret-management',
        '04-operations/ci-cd-docker-k8s',
        '04-operations/canary-shadow',
        '04-operations/dr-tenant-playbook',
        '04-operations/elastic-jobs',
      ],
    },
    {
      type: 'category',
      label: '📖 Reference',
      items: [
        '05-reference/appsettings-guide',
        '05-reference/database-structure',
        '05-reference/extensions-log',
        '05-reference/interface-guide',
        '05-reference/timing-guide',
      ],
    },
    {
      type: 'category',
      label: '📚 Resources',
      items: [
        '06-resources/usage-guide',
        '06-resources/feature-flags',
        '06-resources/muonroibase-template',
        '06-resources/base-template-examples',
        '06-resources/asvs-checklist',
        '06-resources/release-checklist',
        '06-resources/upgrade-guide',
        '06-resources/test-matrix-guide',
        '06-resources/buildingblock/index',
      ],
    },
  ],
};

export default sidebars;
