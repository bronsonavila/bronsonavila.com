import React from 'react';

import Metadata from './Metadata';

/**
 * IE Warning
 *
 * @param {String} title - Metadata title
 */
const IEWarning = ({ title }) => (
  <div className="container mx-auto px-4">
    <Metadata title={title} />
    <div className="global-editor text-center mb-8 pb-1 pt-8">
      <p>Sorry, this page is not supported by Internet Explorer.</p>
      <p>Please use an alternative browser.</p>
    </div>
  </div>
);

export default IEWarning;
