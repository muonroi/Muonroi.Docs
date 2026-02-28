import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Muonroi Building Block',
  tagline: 'Production-ready building blocks for .NET applications',
  favicon: 'img/favicon.ico',

  url: 'https://docs.muonroi.com',
  baseUrl: '/',

  organizationName: 'muonroi',
  projectName: 'Muonroi.Docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn', // Moved here

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    localeConfigs: {
      en: { label: 'English' },
      vi: { label: 'Tiếng Việt' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/docs',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/muonroi/Muonroi.Docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Muonroi Building Block',
      logo: {
        alt: 'Muonroi Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/muonroi/Muonroi.BuildingBlock',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Introduction', to: '/docs/getting-started/introduction' },
            { label: 'Getting Started', to: '/docs/getting-started/getting-started' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'GitHub', href: 'https://github.com/muonroi/Muonroi.BuildingBlock' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Muonroi Building Block. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['csharp', 'bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
