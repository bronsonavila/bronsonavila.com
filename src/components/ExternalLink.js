import { OutboundLink } from 'gatsby-plugin-google-analytics'
import React from 'react'

/**
 * External Link
 *
 * @param {String} href - URL
 * @param {String} text - Inner text
 */
const ExternalLink = ({ href, text }) => (
  <OutboundLink href={href} rel="noopener noreferrer" target="_blank">
    {text}
  </OutboundLink>
)

export default ExternalLink
