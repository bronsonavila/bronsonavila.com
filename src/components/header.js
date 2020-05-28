import React from 'react';
import { Link } from 'gatsby';

import Logo from './Logo';

const Header = () => (
  <header>
    <div className="border-b border-gray-400 h-full mx-6">
      <div className="container flex items-center justify-between h-full mx-auto px-4">
        <Logo />
        <div className="flex items-center">
          <Link className="text-gray-600 hover:text-gray-900" to="/photos/">Photos</Link>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
