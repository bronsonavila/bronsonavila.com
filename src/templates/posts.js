import React from 'react';
import { graphql } from 'gatsby';

export default ({ data }) => {
  const content = data.markdownRemark;

  return (
    <article className="post">
      <h1>{content.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content.html }} />
    </article>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
