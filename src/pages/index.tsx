import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/getting-started">
            Get Started - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Production-ready building blocks for .NET applications">
      <HomepageHeader />
      <main>
        <div className="container padding-vert--xl">
           <div className="row">
              <div className="col col--4">
                <h3>Multi-Tenancy</h3>
                <p>Built-in isolation strategies (DB-per-tenant, Schema-per-tenant, Shared-DB) with seamless integration.</p>
              </div>
              <div className="col col--4">
                <h3>Advanced Auth</h3>
                <p>RBAC, Permissions, JWT, and BFF patterns ready to use out of the box.</p>
              </div>
              <div className="col col--4">
                <h3>Rule Engine</h3>
                <p>A powerful, lightweight rule engine supporting strongly typed rules and dynamic JSON workflows.</p>
              </div>
           </div>
        </div>
      </main>
    </Layout>
  );
}
