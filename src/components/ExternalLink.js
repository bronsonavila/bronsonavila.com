import React from 'react';
import { OutboundLink } from 'gatsby-plugin-google-analytics';

const ExternalLink = ({ text, url }) => (
  <OutboundLink href={url} rel="noopener noreferrer" target="_blank">
    {text}
  </OutboundLink>
);

export default ExternalLink;
