import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";

export default ({ data }) => {
  const content = data.markdownRemark;

  return (
    <section className="gallery">
      <div>
        <h1>{content.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </div>
      <div className="flex flex-wrap">
        {data.allFile.edges.map((image, index) => (
          <Img
            alt={image.node.base.split(".")[0]}
            className="w-1/3"
            fluid={image.node.childImageSharp.fluid}
            key={index}
          />
        ))}
      </div>
    </section>
  );
};

export const query = graphql`
  query($slug: String!, $relativeDirectory: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
    allFile(
      filter: {
        extension: { regex: "/(jpg)|(png)|(jpeg)/" }
        relativeDirectory: { eq: $relativeDirectory }
      }
    ) {
      edges {
        node {
          base
          childImageSharp {
            fluid(maxWidth: 300) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
