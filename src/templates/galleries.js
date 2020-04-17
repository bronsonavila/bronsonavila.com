import React, { useEffect, useRef, useState } from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image/withIEPolyfill';

import GalleryModal from '../components/GalleryModal';

import getTransformMatrixArray from '../utils/getTransformMatrixArray';
import lazyLoad from '../utils/lazyLoad';
import moveElementsRelativeToMouse from '../utils/moveElementsRelativeToMouse';

const delay = 300; // For animations.
const cardSize = 275;
const modalWidth = 931; // Supports images with a 3:2 aspect ratio ONLY.
const modalHeight = modalWidth * (2 / 3);
const modalInitialTransform = `translate(-9999px, -9999px)`;

/**
 * Handles lazy loading of gallery cards, and animates the position of cards on hover.
 */
const animateCards = () => {
  displayGalleryCards();
  lazyLoad(setObserverCallback(delay));
  moveElementsRelativeToMouse({
    additionalTransformValues: 'scale(1.025)',
    containerSelector: '.gallery__card-container',
  });
};

/**
 * Moves the modal over a gallery card, and expands the modal to reveal the full image.
 * By using the `transform` property and inverting the `scale` values of the modal and
 * its inner image container, it is possible to animate the heights and widths of the
 * modal images without the costs incurred by animating `height` and `width` properties.
 * See: https://www.freecodecamp.org/news/animating-height-the-right-way/
 *
 * @param {Node} modal - The modal element.
 * @param {Node} modalParent - The modal's parent element.
 * @param {Node} target - The element that the modal will initially move to.
 */
const animateModal = (modal, modalParent, target) => {
  if (!target) return;

  const modalImageContainer = modal.childNodes[0];
  const targetX = target.offsetLeft - modal.offsetWidth / 2 + target.offsetWidth / 2;
  const targetY = target.offsetTop - modal.offsetHeight / 2 + target.offsetHeight / 2;

  // Immediately move the modal over `target`, and scale the modal down to `target` size:
  modal.style.opacity = 1;
  modal.style.transform = `
      translate(${targetX}px, ${targetY}px)
      scaleX(${target.offsetWidth / modal.offsetWidth})
      scaleY(${target.offsetHeight / modal.offsetHeight})`;
  modalImageContainer.style.transform = `
      scaleX(${modal.offsetWidth / target.offsetWidth})
      scaleY(${modal.offsetHeight / target.offsetHeight})`;

  // Smoothly move the modal to the center of the screen and expand it to its full size:
  setTimeout(() => {
    const centerX = document.body.offsetWidth / 2 - modal.offsetWidth / 2;
    const centerY =
      document.body.offsetHeight / 2 -
      modal.offsetHeight / 2 -
      modalParent.getBoundingClientRect().top / 2 +
      window.scrollY / 2;

    modal.classList.add('is-smooth');
    modal.style.transform = `translate(${centerX + 0.5}px, ${centerY}px) scale(1)`;
    modalImageContainer.style.transform = 'scale(1)';
  }, delay * 2);
};

/**
 * Slides the modal out of view before moving it back to its default position.
 *
 * @param {Node} modal - The modal element.
 */
const resetModal = modal => {
  const transformMatrixArray = getTransformMatrixArray(modal);
  const x = transformMatrixArray[4];
  const y = Number(transformMatrixArray[5]);

  modal.style.opacity = 0;
  modal.style.transform = `translate(${x}px, ${y + window.innerHeight}px)`;

  setTimeout(() => {
    modal.classList.remove('is-smooth');
    modal.style.transform = modalInitialTransform;
  }, delay);
};

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
    // Must trigger before `setObserverCallback` runs:
    setTimeout(() => card.classList.add('is-visible'), (index * delay) / 3.666);
  });
};

/**
 * Callback for the `lazyLoad` IntersectionObserver. Animates the entrance of
 * each `.gallery__card` element.
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

export default ({ data }) => {
  const content = data.markdownRemark;
  const images = data.allFile.edges;

  const [activeCard, setActiveCard] = useState(null);
  const cardRefs = images.map(image => useRef(null));
  const modalParentRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(animateCards);
  useEffect(() => animateModal(modalRef.current, modalParentRef.current, activeCard), [
    activeCard,
  ]);

  return (
    <section className="gallery">
      <div>
        <h1>{content.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      </div>
      <div className="gallery__cards" ref={modalParentRef}>
        <GalleryModal
          activeCardIndex={activeCard && Number(activeCard.dataset.index)}
          cardSize={cardSize}
          handleClose={() => {
            resetModal(modalRef.current);
            setTimeout(() => setActiveCard(null), delay);
          }}
          height={modalHeight}
          images={images}
          initialTransform={modalInitialTransform}
          ref={modalRef}
          width={modalWidth}
        />
        {images.map((image, index) => (
          <div className="gallery__card-container" key={index}>
            <div
              className="gallery__card observable"
              data-index={index}
              data-node-base={image.node.base}
              data-observer-root-margin="0px 0px 25%" // Best with bottom margin.
              onClick={() => setActiveCard(cardRefs[index].current)}
              onMouseDown={e => (cardRefs[index].current.style = '')}
              ref={cardRefs[index]}
            >
              <Img
                alt={image.node.base.split('.')[0]}
                className="h-full w-full"
                fluid={image.node.childImageSharp.fluid}
              />
            </div>
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
            fixed(width: 929, quality: 100) {
              ...GatsbyImageSharpFixed
            }
            fluid(maxWidth: 500) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
