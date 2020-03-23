/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from "react";
import Transition from "./src/components/transition";

export const wrapPageElement = ({ element, props }) => {
  return <Transition {...props}>{element}</Transition>;
};
