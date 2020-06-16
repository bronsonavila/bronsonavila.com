import React, { useEffect, useRef } from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';

import IEWarning from '../../components/IEWarning';
import Metadata from '../../components/Metadata';

import lazyLoad from '../../utils/lazyLoad';

const delay = 300; // For animations and transitions.

/**
 * Handles lazy loading of gallery cards.
 */
const animateCards = () => {
  displayCards();
  lazyLoad(setObserverCallback(delay));
};

/**
 * Changes the display of `.observable` elements from `none` to `block`.
 */
const displayCards = () => {
  const cards = [...document.querySelectorAll('.observable')];

  cards.forEach((card, index) => {
    // Must trigger before `setObserverCallback` runs.
    setTimeout(() => card.classList.add('is-visible'), (index * delay) / 3.666);
  });
};

/**
 * Callback for the `lazyLoad` IntersectionObserver. Animates the entrance of
 * each `.observable` element.
 *
 * @param {Integer} delay - The `setTimeout` delay value.
 * @return {Function} - An IntersectionObserver callback function.
 */
const setObserverCallback = delay => entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('has-entered'), delay / 3);
    }
  });
};

export default () => {
  // Disable page on Internet Explorer.
  if (typeof document !== 'undefined' && !!document.documentMode) {
    return <IEWarning title="Photos" />;
  }

  const data = useStaticQuery(
    graphql`
      query {
        galleries: allContentfulGallery(sort: { order: ASC, fields: title }) {
          nodes {
            title
            slug
            featured_image {
              fluid(maxWidth: 273, quality: 91) {
                ...GatsbyContentfulFluid_withWebp
              }
            }
          }
        }
      }
    `
  );

  const galleries = data.galleries.nodes;

  const cardRefs = galleries.map(image => useRef(null));

  useEffect(() => {
    setTimeout(() => animateCards(), delay);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <Metadata title="Photos" />
      <h1 className="text-center mb-20 pb-3 pt-8">Photos</h1>
      <div className="photo-gallery-index__cards flex flex-col md:flex-row md:flex-wrap items-center justify-between w-full">
        {galleries.map((gallery, index) => (
          <React.Fragment key={index}>
            <div className="photo-gallery-index__card-container h-full sm:w-full">
              <Link
                className="photo-gallery-index__card observable relative hidden h-0 bg-white
                  border-gray-400 shadow opacity-0 cursor-pointer w-full z-10"
                data-observer-root-margin="0px 0px 25%" // Best with bottom margin.
                onMouseDown={e => (cardRefs[index].current.style = '')}
                ref={cardRefs[index]}
                to={`/photos/${gallery.slug}/`}
              >
                <Img
                  alt={gallery.featured_image.title}
                  className="h-full w-full"
                  fluid={gallery.featured_image.fluid}
                />
                <p className="photo-gallery-index__card-label absolute whitespace-pre mt-10 hover:text-gray-600">
                  {gallery.title}
                </p>
              </Link>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
