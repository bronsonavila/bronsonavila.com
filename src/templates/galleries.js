import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';

export default ({ data }) => {
  const content = data.markdownRemark;

  useEffect(() => {
    const images = [...document.querySelectorAll('.gatsby-image-wrapper')];
    images.forEach((image, index) => {
      setTimeout(() => {
        image.style.display = 'block';
      }, (index * 300) / 2.333);
      setTimeout(() => {
        image.style.opacity = 1;
        image.style.transform = 'scale(0.9) translateY(0)';
      }, (index * 300) / 2);
    });
  });

  return (
    <section className="gallery">
      <div>
        <h1>{content.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </div>
      <div className="flex flex-wrap">
        {data.allFile.edges.map((image, index) => (
          <Img
            alt={image.node.base.split('.')[0]}
            className="w-1/3 transition duration-300 ease-in-out"
            fluid={image.node.childImageSharp.fluid}
            data-element="image"
            key={index}
            style={{
              display: 'none',
              maxHeight: '184.16px',
              opacity: 0,
              transform: `scale(0.8) translateY(100px)`,
            }}
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
        sourceInstanceName: { eq: "images" }
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
