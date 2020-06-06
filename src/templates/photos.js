import React, { useEffect, useRef, useState } from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';

import IEWarning from '../components/IEWarning';
import Metadata from '../components/Metadata';
import PhotoGalleryModal from '../components/PhotoGalleryModal';

import getTransformMatrixArray from '../utils/getTransformMatrixArray';
import lazyLoad from '../utils/lazyLoad';
import moveElementsRelativeToMouse from '../utils/moveElementsRelativeToMouse';

const delay = 300; // For animations and transitions.

/**
 * Handles lazy loading of gallery cards, and animates the position of cards on hover.
 */
const animateCards = () => {
  displayPhotoGalleryCards();
  lazyLoad(setObserverCallback(delay));
  moveElementsRelativeToMouse({
    additionalTransformValues: 'scale(1.025)',
    containerSelector: '.photo-gallery__card-container',
  });
};

/**
 * Moves the modal over a gallery card, and expands the modal to reveal the full image.
 * See: https://www.freecodecamp.org/news/animating-height-the-right-way/
 *
 * @param {Node} photoGalleryRef
 * @param {Node} modal
 * @param {Function} setModalIsOpen
 * @param {Node} target - The element that the modal will initially move to.
 */
const animateModal = (photoGalleryRef, modal, setModalIsOpen, target) => {
  if (!target) return;

  const modalImagesContainer = modal.childNodes[0];
  const targetX = target.offsetLeft - modal.offsetWidth / 2 + target.offsetWidth / 2;
  const targetY = target.offsetTop - modal.offsetHeight / 2 + target.offsetHeight / 2;

  // Immediately move the modal over `target`, and scale the modal down to `target` size.
  modal.style.opacity = 1;
  modal.style.transform = `
      translate(${targetX}px, ${targetY}px)
      scaleX(${target.offsetWidth / modal.offsetWidth})
      scaleY(${target.offsetHeight / modal.offsetHeight})`;
  modalImagesContainer.style.transform = `
      scaleX(${modal.offsetWidth / target.offsetWidth})
      scaleY(${modal.offsetHeight / target.offsetHeight})`;

  // Smoothly move the modal to the center of the screen and expand it to its full size.
  setTimeout(() => {
    const centerX = document.body.offsetWidth / 2 - modal.offsetWidth / 2;
    const centerY =
      document.body.offsetHeight / 2 -
      modal.offsetHeight / 2 -
      photoGalleryRef.getBoundingClientRect().top / 2 +
      window.scrollY / 2 -
      33.5; // Necessary offset (basis for calculation unknown).
    // `scale` ensures the modal height does not exceed the screen height.
    const scale =
      modal.offsetHeight + 45 > window.innerHeight
        ? window.innerHeight / (modal.offsetHeight + 45)
        : 1;

    setModalIsOpen(true);
    modal.style.transform = `translate(${centerX}px, ${centerY}px) scale(${scale})`;
    modalImagesContainer.style.transform = 'scale(1)';
  }, delay * 2);
};

/**
 * Displays the next/previous image in the gallery modal, or loops back to the
 * beginning/end of the modal where appropriate (based on the `activeCard` position).
 *
 * @param {Node} activeCard
 * @param {Array} cardRefs
 * @param {String} direction - `next` or `previous`
 * @param {Function} setActiveCard
 */
const changeModalImage = (activeCard, cardRefs, direction, setActiveCard) => {
  if (activeCard) {
    const activeCardIndex = Number(activeCard.dataset.index);
    let index;

    if (direction === 'next') {
      index = activeCardIndex === cardRefs.length - 1 ? 0 : activeCardIndex + 1;
    } else {
      index = activeCardIndex === 0 ? cardRefs.length - 1 : activeCardIndex - 1;
    }

    setActiveCard(cardRefs[index].current);
  }
};

/**
 * Changes the display of `.photo-gallery__card` elements from `none` to `block` at
 * staggered intervals. This allows the first batch of initially displayed
 * cards to be revealed in sequential order rather than all at once. This is
 * because the `lazyLoad` IntersectionObserver will not detect elements until
 * `display: none` has been changed to a visible value.
 */
const displayPhotoGalleryCards = () => {
  const cards = [...document.querySelectorAll('.photo-gallery__card')];

  cards.forEach((card, index) => {
    // Must trigger before `setObserverCallback` runs.
    setTimeout(() => card.classList.add('is-visible'), (index * delay) / 3.666);
  });
};

/**
 * Allows the user to navigate the modal via the `ArrowLeft`, `ArrowRight`, and
 * `Escape` keys.
 *
 * @param {Node} activeCard
 * @param {Array} cardRefs
 * @param {Event} lastKeyboardEvent
 * @param {Node} modal
 * @param {Function} resetModal
 * @param {Function} setActiveCard
 * @param {Fucntion} setLastNavigationDirection
 * @param {Function} setModalHasSmoothTransition
 * @param {Function} setModalIsOpen
 */
const handleKeyboardNavigation = (
  activeCard,
  cardRefs,
  lastKeyboardEvent,
  modal,
  resetModal,
  setActiveCard,
  setLastNavigationDirection,
  setModalHasSmoothTransition,
  setModalIsOpen
) => {
  if (lastKeyboardEvent) {
    let direction;
    if (lastKeyboardEvent.key === 'ArrowLeft') {
      direction = 'previous';
    } else if (lastKeyboardEvent.key === 'ArrowRight') {
      direction = 'next';
    } else if (lastKeyboardEvent.key === 'Escape') {
      setModalHasSmoothTransition(false);
      resetModal(modal, setActiveCard, setModalIsOpen);
    }
    if (direction) {
      setModalHasSmoothTransition(true);
      changeModalImage(activeCard, cardRefs, direction, setActiveCard);
      setLastNavigationDirection(direction); // Prevents unnecessary modal animation.
    }
  }
};

/**
 * Sets the modal width when the window is resized.
 *
 * @param {Integer} innerWidth - value of `lastInnerDimensions.width`
 * @param {Function} setModalWidth
 */
const handleModalResize = (innerWidth, setModalWidth) => {
  if (innerWidth >= 1024) {
    setModalWidth(931); // 2px wider than `$image-width--lg` in `src/styles/gallery.scss`.
  } else if (innerWidth >= 768) {
    setModalWidth(740);
  } else if (innerWidth >= 640) {
    setModalWidth(612);
  } else {
    setModalWidth(innerWidth - 28);
  }
};

/**
 * Throttles gallery navigation via next/previous buttons and left/right arrows.
 *
 * @param {Function} setIsThrottled
 */
const handleThrottle = setIsThrottled => {
  setIsThrottled(true);
  setTimeout(() => setIsThrottled(false), delay * 1.25);
};

/**
 * Slides the modal out of view before moving it back to its default position.
 *
 * @param {Node} modal
 * @param {Function} setActiveCard
 * @param {Function} setModalIsOpen
 */
const resetModal = (modal, setActiveCard, setModalIsOpen) => {
  const transformMatrixArray = getTransformMatrixArray(modal);

  if (transformMatrixArray) {
    const x = transformMatrixArray[4];
    const y = Number(transformMatrixArray[5]);

    modal.style.opacity = 0;
    modal.style.transform = `translate(${x}px, ${y + window.innerHeight}px)`;

    setTimeout(() => {
      setActiveCard(null);
      setModalIsOpen(false);
      modal.style.transform = '';
    }, delay);
  }
};

/**
 * Transforms the GraphQL `image_metadata` array into an object where each image's
 * `name` is a key.
 *
 * @param {Array} imageMetadata - `image_metadata` with `name` and `caption` subfields.
 * @return {Object}
 */
const setImageMetadata = imageMetadata => {
  return imageMetadata.reduce((map, image) => {
    map[image.name] = { caption: image.caption };
    return map;
  }, {});
};

/**
 * Adds an event listener to the `document` object to track keyboard events.
 *
 * @param {Function} setLastKeyboardEvent
 * @return {Function} - Cleanup function.
 */
const setKeyboardEventListeners = setLastKeyboardEvent => {
  const onKeyDown = e => setLastKeyboardEvent(e);
  document.addEventListener('keydown', onKeyDown);
  return () => document.removeEventListener('keydown', onKeyDown);
};

/**
 * Callback for the `lazyLoad` IntersectionObserver. Animates the entrance of
 * each `.photo-gallery__card` element.
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

/**
 * Sets a `resize` event listener on the `window` object.
 *
 * @param {Function} setLastInnerDimensions
 * @return {Function} - Cleanup function.
 */
const setResizeEventListener = setLastInnerDimensions => {
  const onResize = () =>
    setLastInnerDimensions({ height: window.innerHeight, width: window.innerWidth });
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
};

export default ({ data }) => {
  const content = data.markdownRemark;
  const cardImages = data.cardImages.edges;
  const modalImages = data.modalImages.edges;

  // Disable page on Internet Explorer.
  if (typeof document !== 'undefined' && !!document.documentMode) {
    return <IEWarning title={content.frontmatter.title} />;
  }

  const [activeCard, setActiveCard] = useState(null);
  const [isThrottled, setIsThrottled] = useState(false);
  const [lastInnerDimensions, setLastInnerDimensions] = useState(
    typeof window !== 'undefined'
      ? { height: window.innerHeight, width: window.innerWidth }
      : null
  );
  const [lastKeyboardEvent, setLastKeyboardEvent] = useState(null);
  const [lastNavigationDirection, setLastNavigationDirection] = useState('');
  const [modalHasSmoothTransition, setModalHasSmoothTransition] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalWidth, setModalWidth] = useState(null);

  const cardRefs = cardImages.map(image => useRef(null));
  const modalRef = useRef(null);
  const photoGalleryRef = useRef(null);

  // Animation effects.
  useEffect(() => {
    setTimeout(() => animateCards(), delay); // Initial load is sluggish without delay.
  });
  useEffect(() => {
    // Prevent modal animation when user presses next/previous buttons or left/right
    // arrow keys. The animation should only occur when clicking a gallery card.
    if (lastNavigationDirection !== 'next' && lastNavigationDirection !== 'previous') {
      animateModal(photoGalleryRef.current, modalRef.current, setModalIsOpen, activeCard);
    }
  }, [activeCard, lastNavigationDirection]);

  // Keyboard effects.
  useEffect(() => setKeyboardEventListeners(setLastKeyboardEvent), []);
  useEffect(() => {
    if (!isThrottled) {
      handleThrottle(setIsThrottled);
      handleKeyboardNavigation(
        activeCard,
        cardRefs,
        lastKeyboardEvent,
        modalRef.current,
        resetModal,
        setActiveCard,
        setLastNavigationDirection,
        setModalHasSmoothTransition,
        setModalIsOpen
      );
    }
  }, [lastKeyboardEvent]);

  // Resize effects (reset modal whenever the screen size changes).
  useEffect(() => setResizeEventListener(setLastInnerDimensions), []);
  useEffect(() => {
    handleModalResize(lastInnerDimensions.width, setModalWidth);
    setModalHasSmoothTransition(false);
    resetModal(modalRef.current, setActiveCard, setModalIsOpen);
  }, [lastInnerDimensions]);

  return (
    <>
      <Metadata title={content.frontmatter.title} />
      <section
        className="photo-gallery"
        onClick={() => {
          setModalHasSmoothTransition(false);
          resetModal(modalRef.current, setActiveCard, setModalIsOpen);
        }}
        ref={photoGalleryRef}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-center mb-16 pb-1 pt-8">{content.frontmatter.title}</h1>
          <div
            className="global-editor mb-16 pb-1"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />
          <div className="photo-gallery__cards flex flex-wrap justify-between w-full">
            <PhotoGalleryModal
              activeCardIndex={activeCard && Number(activeCard.dataset.index)}
              handleClose={() => {
                setModalHasSmoothTransition(false);
                resetModal(modalRef.current, setActiveCard, setModalIsOpen);
              }}
              handleNextImage={() => {
                if (!isThrottled) {
                  handleThrottle(setIsThrottled);
                  // The smooth slideshow transition between images should only occur when
                  // changing images via next/previous buttons or left/right arrows. The
                  // transition should otherwise be immediate when clicking a gallery card.
                  setModalHasSmoothTransition(true);
                  changeModalImage(activeCard, cardRefs, 'next', setActiveCard);
                  setLastNavigationDirection('next');
                }
              }}
              handlePreviousImage={() => {
                if (!isThrottled) {
                  handleThrottle(setIsThrottled);
                  setModalHasSmoothTransition(true);
                  changeModalImage(activeCard, cardRefs, 'previous', setActiveCard);
                  setLastNavigationDirection('previous');
                }
              }}
              hasSmoothTransition={modalHasSmoothTransition}
              height={modalWidth * (2 / 3)} // Supports images with a 3:2 aspect ratio ONLY.
              imageMetadata={
                content.frontmatter.image_metadata
                  ? setImageMetadata(content.frontmatter.image_metadata)
                  : null
              }
              images={modalImages}
              isOpen={modalIsOpen}
              lastNavigationDirection={lastNavigationDirection}
              ref={modalRef}
              width={modalWidth}
            />
            {cardImages.map((image, index) => (
              <div className="photo-gallery__card-container h-full sm:w-full" key={index}>
                <div
                  className="photo-gallery__card observable relative hidden h-0 bg-white
                  border border-gray-400 shadow opacity-0 cursor-pointer w-full z-10"
                  data-index={index}
                  data-node-base={image.node.base}
                  data-observer-root-margin="0px 0px 25%" // Best with bottom margin.
                  onClick={e => {
                    if (!isThrottled) {
                      e.stopPropagation();
                      handleThrottle(setIsThrottled);
                      setModalHasSmoothTransition(false);
                      setActiveCard(cardRefs[index].current);
                      setLastNavigationDirection('');
                    }
                  }}
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
        </div>
      </section>
    </>
  );
};

// `quality: 91` appears to offer the best file size reduction for JPEGs without any
// noticeable loss in image quality. The `maxWidth` of images should be 2px smaller
// than the `modalWidth` value to account for a 1px border.
export const query = graphql`
  query($slug: String!, $relativeDirectory: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        image_metadata {
          name
          caption
        }
        title
      }
    }
    cardImages: allFile(
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
            fluid(maxWidth: 273, quality: 91) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
    modalImages: allFile(
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
            fluid(maxWidth: 929, quality: 91) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
