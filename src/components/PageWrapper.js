/**
 * Wraps all pages with a static header and a transition-enabled router.
 */
import React from "react";
import { PoseGroup } from "react-pose";
import { useStaticQuery, graphql } from "gatsby";

import Header from "./header";
import Layout from "./layout";
import Transition from "./Transition";

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
      <PoseGroup>
        <Transition key={location.pathname}>
          <Layout>{children}</Layout>
        </Transition>
      </PoseGroup>
    </>
  );
};

export default PageWrapper;
