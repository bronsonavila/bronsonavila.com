import React from 'react';

import Logo from './Logo';

const Header = () => (
  <header>
    <div className="border-b border-gray-400 h-full mx-6">
      <div className="container flex items-center h-full mx-auto px-4">
        <Logo />
      </div>
    </div>
  </header>
);

export default Header;
