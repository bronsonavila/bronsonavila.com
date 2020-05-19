import React from 'react';
import { Link } from 'gatsby';

import SEO from '../components/SEO';
import MarkdownList from '../components/MarkdownList';

const IndexPage = () => (
  <div className="container mx-auto px-4">
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <MarkdownList />
    <Link to="/page-2/">Go to page 2</Link>
  </div>
);

export default IndexPage;
