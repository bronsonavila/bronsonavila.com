/**
 * Wraps all pages with a static header and a transition-enabled router.
 */
import React from 'react';
import { PoseGroup } from 'react-pose';
import { useStaticQuery, graphql } from 'gatsby';

import Header from './Header';
import Layout from './Layout';
import Transition from './Transition';

const PageWrapper = ({ children, location }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <PoseGroup
        // Use an `auto` height combined with a calculated `minHeight` to ensure
        // that the container fills the available screen height, minus any
        // offset required for the footer. This is especially necessary due to
        // problematic behavior associated with Flexbox on Safari. See, e.g.:
        // https://www.labsrc.com/safari-full-height-flexbox-children/
        className="relative flex flex-col flex-grow h-auto"
        style={{ minHeight: 'calc(100% - 87px)' }}
      >
        <Transition key={location.pathname}>
          <Layout>{children}</Layout>
        </Transition>
      </PoseGroup>
    </>
  );
};

export default PageWrapper;
