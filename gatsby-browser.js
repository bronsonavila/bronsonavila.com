/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react';
import PageWrapper from 'components/PageWrapper';

import 'styles/_styles.scss';

// Required for page transition animation.
export const wrapPageElement = ({ element, props }) => {
  return <PageWrapper {...props}>{element}</PageWrapper>;
};

// Hide footer when changing routes.
export const onPreRouteUpdate = ({ location, prevLocation }) => {
  const footer = document.querySelector('footer');

  if (footer) {
    footer.classList.remove('is-active');
  }
};
