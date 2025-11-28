import React from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import IconHome from '@theme/Icon/Home';
import styles from './styles.module.css';

const HOME_URL = 'https://omnimaas.com';

export default function HomeBreadcrumbItem() {
  return (
    <li className="breadcrumbs__item">
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Home page',
          description: 'ARIA label for the home page link in breadcrumbs',
        })}
        className="breadcrumbs__link"
        href={HOME_URL}
        target="_blank"
        rel="noopener noreferrer">
        <IconHome className={styles.breadcrumbHomeIcon} />
      </Link>
    </li>
  );
}

