import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image/withIEPolyfill';

import { lazyLoad } from '../utils/lazyLoad';

const delay = 300; // For lazy loading animation.

/**
 * Changes the display of `.gallery__card` elements from `none` to `block` at
 * staggered intervals. This allows the first batch of initially displayed
 * cards to be revealed in sequential order rather than all at once. This is
 * because the `lazyLoad` IntersectionObserver will not detect elements until
 * `display: none` has been changed to a visible value.
 */
const displayGalleryCards = () => {
  const cards = [...document.querySelectorAll('.gallery__card')];

  cards.forEach((card, index) => {
    // Must trigger before `observerCallback` runs:
    setTimeout(() => card.classList.add('is-visible'), (index * delay) / 3.666);
  });
};

/**
 * Callback for the `lazyLoad` IntersectionObserver. Animates the entrance of
 * each `.gallery__card` element.
 *
 * @param {Array} entries - An array of IntersectionObserverEntry objects.
 */
const observerCallback = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('has-entered'), delay / 3);
    }
  });
};

export default ({ data }) => {
  const content = data.markdownRemark;

  // Handle lazy loading:
  useEffect(() => {
    displayGalleryCards();
    lazyLoad(observerCallback);
  });

  return (
    <section className="gallery">
      <div>
        <h1>{content.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </div>
      <div className="gallery__card-container">
        {data.allFile.edges.map((image, index) => (
          <div
            className="gallery__card observable"
            data-observer-root-margin="0px 0px 6%" // Best with bottom margin.
            key={index}
          >
            <Img
              alt={image.node.base.split('.')[0]}
              className="h-full w-full"
              fluid={image.node.childImageSharp.fluid}
            />
          </div>
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
      sort: { fields: name }
    ) {
      edges {
        node {
          base
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
