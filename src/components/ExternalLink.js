import React from 'react';

const ExternalLink = ({ text, url }) => (
  <a href={url} rel="noopener noreferrer" target="_blank">
    {text}
  </a>
);

export default ExternalLink;
