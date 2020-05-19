import React from 'react';
import { Link } from 'gatsby';

import SEO from '../components/SEO';

const SecondPage = () => (
  <div className="container mx-auto px-4">
    <SEO title="Page two" />
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>
  </div>
);

export default SecondPage;
