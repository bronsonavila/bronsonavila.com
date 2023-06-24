import { PoseGroup } from 'react-pose'
import Header from 'components/Header'
import Layout from 'components/Layout'
import React, { FC, ReactNode } from 'react'
import Transition from 'components/Transition'

type PageWrapperProps = {
  children: ReactNode
  location: {
    pathname: string
  }
}

const HEADER_HEIGHT = '87px'

const PageWrapper: FC<PageWrapperProps> = ({ children, location: { pathname } }) => (
  <>
    <Header pathname={pathname} />

    <PoseGroup
      // Ensuring full screen height, accounting for header offset.
      // This resolves a flexbox issue in Safari.
      // See: https://www.labsrc.com/safari-full-height-flexbox-children/
      className="relative flex flex-col flex-grow h-auto"
      style={{ minHeight: `calc(100% - ${HEADER_HEIGHT})` }}
    >
      <Transition key={pathname}>
        <Layout>{children}</Layout>
      </Transition>
    </PoseGroup>
  </>
)

export default PageWrapper
