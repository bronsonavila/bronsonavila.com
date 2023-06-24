import { OutboundLink } from 'gatsby-plugin-google-analytics'
import React, { FC } from 'react'

type ExternalLinkProps = {
  href: string
  text: string
}

const ExternalLink: FC<ExternalLinkProps> = ({ href, text }) => (
  <OutboundLink href={href} rel="noopener noreferrer" target="_blank">
    {text}
  </OutboundLink>
)

export default ExternalLink
