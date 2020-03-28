/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React from "react";
import PageWrapper from "./src/components/PageWrapper";

import "./src/styles/_styles.scss"

export const wrapPageElement = ({ element, props }) => {
  return <PageWrapper {...props}>{element}</PageWrapper>;
};
