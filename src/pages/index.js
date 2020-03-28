import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";
import AllFileTable from "../components/allFileTable";
import MarkdownList from "../components/MarkdownList";

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Link to="/page-2/">Go to page 2</Link>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <AllFileTable />
    <MarkdownList />
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
);

export default IndexPage;
