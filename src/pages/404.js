import React from 'react';

import Metadata from '../components/Metadata';

const NotFoundPage = () => (
  <div className="container mx-auto px-4">
    <Metadata title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </div>
);

export default NotFoundPage;
