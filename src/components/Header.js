import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';

import Logo from './Logo';

/**
 * Header
 *
 * @param {String} pathname - URL path
 */
const Header = ({ pathname }) => (
  <header>
    <div className="border-b border-gray-400 h-full mx-6">
      <div className="container flex items-center justify-between h-full mx-auto px-4">
        <Logo />
        <div className="flex items-center">
          <Link
            className={`text-sm xs:text-base focus:text-gray-900 hover:text-gray-900 mr-6 xxs:mr-10 xs:mr-12 ${
              pathname === '/about/' ? 'text-gray-900' : 'text-gray-600'
            }`}
            to="/about/"
          >
            About
          </Link>
          <Link
            className={`text-sm xs:text-base focus:text-gray-900 hover:text-gray-900 mr-6 xxs:mr-10 xs:mr-12 ${
              pathname === '/photos/' ? 'text-gray-900' : 'text-gray-600'
            }`}
            to="/photos/"
          >
            Photos
          </Link>
          <Link
            className={`text-sm xs:text-base focus:text-gray-900 hover:text-gray-900 ${
              pathname === '/contact/' ? 'text-gray-900' : 'text-gray-600'
            }`}
            to="/contact/"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
