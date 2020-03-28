import React from "react";
import posed, { PoseGroup } from "react-pose";
import { useStaticQuery, graphql } from "gatsby";

import Header from "./header";

const timeout = 200;

const RoutesContainer = posed.div({
  enter: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    delay: timeout,
    delayChildren: timeout,
  },
  exit: {
    opacity: 0,
    filter: "blur(20px)",
    y: 30,
  },
});

const Transition = ({ children, location }) => {
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
        <RoutesContainer key={location.pathname}>{children}</RoutesContainer>
      </PoseGroup>
    </>
  );
};

export default Transition;
