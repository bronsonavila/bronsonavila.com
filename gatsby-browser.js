/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react'
import PageWrapper from 'components/PageWrapper'

import 'styles/index.scss'

// Required for page transition animation.
export const wrapPageElement = ({ element, props }) => {
  return <PageWrapper {...props}>{element}</PageWrapper>
}

// Hide footer when changing routes.
export const onPreRouteUpdate = () => {
  const footer = document.querySelector('footer')

  footer?.classList.remove('is-active')
}
