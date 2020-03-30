/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';

const Layout = ({ children }) => (
  <>
    <div className="container h-full mx-auto px-4 py-6">
      <main className="mb-16">{children}</main>
    </div>
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
