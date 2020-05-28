import React from 'react';
import { Link } from 'gatsby';

import Metadata from '../components/Metadata';

const IndexPage = () => (
  <div className="container mx-auto px-4">
    <Metadata title="Welcome" />
    <h1 className="text-center pt-8 pb-1">Welcome</h1>
  </div>
);

export default IndexPage;
