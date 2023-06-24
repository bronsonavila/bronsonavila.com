import { Link } from 'gatsby'
import Logo from 'components/Logo'
import React, { FC } from 'react'

type HeaderProps = {
  pathname: string
}

const NAV_LINKS = [
  { path: '/about/', label: 'About' },
  { path: '/photos/', label: 'Photos' },
  { path: '/contact/', label: 'Contact' }
]

const Header: FC<HeaderProps> = ({ pathname }) => {
  const renderNavLink = (path: string, label: string) => (
    <Link
      className={`text-sm xs:text-base focus:text-gray-900 hover:text-gray-900 mr-6 xxs:mr-10 xs:mr-12 ${
        pathname === path ? 'text-gray-900' : 'text-gray-600'
      }`}
      key={path}
      to={path}
    >
      {label}
    </Link>
  )

  return (
    <header>
      <div className="border-b border-gray-400 h-full mx-6">
        <div className="container flex items-center justify-between h-full mx-auto px-4">
          <Logo />

          <div className="flex items-center">{NAV_LINKS.map(({ path, label }) => renderNavLink(path, label))}</div>
        </div>
      </div>
    </header>
  )
}

export default Header
