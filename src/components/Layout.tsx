import Footer from 'components/Footer'
import React, { FC, ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => (
  <>
    <main className="h-full mb-16 p-6">{children}</main>

    <Footer />
  </>
)

export default Layout
