import React from "react";
import { Link } from "gatsby";

// import Image from "../components/Image";
import SEO from "../components/SEO";
// import AllFileTable from "../components/AllFileTable";
import MarkdownList from "../components/MarkdownList";

import ChernobylGallery from "../components/images/ChernobylGallery";

const IndexPage = () => (
  <>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Link to="/page-2/">Go to page 2</Link>
    <ChernobylGallery />
    {/* <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div> */}
    {/* <AllFileTable /> */}
    <MarkdownList />
    <Link to="/page-2/">Go to page 2</Link>
  </>
);

export default IndexPage;
