import React from 'react';

import Footer from './Footer';

/**
 * Layout
 *
 * Applies the `main` content and `Footer` on each page.
 *
 * @param {Object} children - React's `children` prop
 */
const Layout = ({ children }) => (
  <>
    <main className="h-full mb-16 p-6">{children}</main>
    <Footer />
  </>
);

export default Layout;
