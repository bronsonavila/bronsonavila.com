import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

const Header = ({ siteTitle }) => (
  <header className="border-b border-gray-300 mb-4 mx-6">
    <div className="container mx-auto px-4 py-4">
      <h1 className="m-0">
        <Link to="/" className="no-underline">
          <span className="text-gray-900">B</span>
          <span className="text-red-800">.</span>
          <span className="text-gray-900">A</span>
          <span className="text-red-800">.</span>
        </Link>
      </h1>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
