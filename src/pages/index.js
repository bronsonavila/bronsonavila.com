import React from 'react';
import { Link } from 'gatsby';

import SEO from '../components/SEO';

const IndexPage = () => (
  <div className="container mx-auto px-4">
    <SEO title="Home" />
    <h1 className="text-center pt-8 pb-1">Hello</h1>
    <Link to="/photos/">Go to photos</Link>
  </div>
);

export default IndexPage;
