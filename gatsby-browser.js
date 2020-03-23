/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from "react";
import Transition from "./src/components/transition";

import "./src/styles/_styles.scss"

export const wrapPageElement = ({ element, props }) => {
  return <Transition {...props}>{element}</Transition>;
};
