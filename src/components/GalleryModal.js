import React, { useState } from 'react';
import Img from 'gatsby-image';

import Caret from '../../static/svg/circle-caret.svg';
import Close from '../../static/svg/circle-close.svg';

/**
 * Sets classes on each image to ensure appropriate display and animation.
 *
 * For the best visual effect, when an image slides out of view, its opacity should remain
 * at 100 for the duration of the animation. When an image slides into view, it should
 * start with its opacity at 0 and fade in to 100. However, it has proved difficult to
 * perfectly implement this behavior. As a workaround, the `lastNavigationDirection` is
 * used to apply `.will-fade-in` when a user successively presses the next/previous
 * buttons or left/right arrow keys. However, the fading will not occur on the initial
 * next/previous or left/right movement.
 *
 * An attempt was made to use `setTimeout` to apply `.will-fade-in` to each `.is-next` and
 * `.is-previous` element after a short delay. This did ensure that all images sliding in
 * would fade in, and that the image sliding out would not fade out. However, this usage
 * of `setTimeout` resulted in suboptimal performance and "chunky" transitions.
 *
 * @param {Integer} activeCardIndex
 * @param {Integer} imagesLength - The total number of images in the gallery.
 * @param {Integer} index - The index of the current image in the map sequence.
 * @param {String} lastNavigationDirection - Either `next` or `previous`.
 */
const setImageClasses = (
  activeCardIndex,
  imagesLength,
  index,
  lastNavigationDirection
) => {
  const isNext =
    index === activeCardIndex + 1 ||
    (index === 0 && activeCardIndex === imagesLength - 1);
  const isPrevious =
    index === activeCardIndex - 1 ||
    (activeCardIndex === 0 && index === imagesLength - 1);

  if (activeCardIndex === index) {
    return 'is-displayed';
  } else if (isNext) {
    return `is-next ${lastNavigationDirection === 'next' ? 'will-fade-in' : ''}`;
  } else if (isPrevious) {
    return `is-previous ${lastNavigationDirection === 'previous' ? 'will-fade-in' : ''}`;
  } else {
    return '';
  }
};

const GalleryModal = React.forwardRef(
  (
    {
      activeCardIndex,
      handleNextImage,
      handlePreviousImage,
      handleClose,
      height,
      imageMetadata,
      images,
      isOpen,
      lastNavigationDirection,
      width,
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(null);
    const modalStateClasses =
      `${isHovered ? 'is-hovered ' : ''}` + `${isOpen ? 'is-open ' : ''}`;

    return (
      <div
        className={`gallery-modal ${modalStateClasses}`}
        onClick={e => e.stopPropagation()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={ref}
        style={{
          height: `${height}px`,
          width: `${width}px`,
        }}
      >
        <div
          className="relative overflow-hidden transition-all duration-300 ease-in-out"
          style={{ height: `${height}px` }}
        >
          {/* Buttons */}
          <button
            className="gallery-modal__button--close"
            onClick={handleClose}
            tabIndex={isHovered ? 0 : -1}
          >
            <Close />
          </button>
          <button
            className="gallery-modal__button--previous"
            onClick={handlePreviousImage}
            tabIndex={isHovered ? 0 : -1}
          >
            <Caret />
          </button>
          <button
            className="gallery-modal__button--next"
            onClick={handleNextImage}
            tabIndex={isHovered ? 0 : -1}
          >
            <Caret />
          </button>

          {/* Images */}
          {images.map((image, index) => {
            const imageName = image.node.base;

            return (
              <figure
                // Prevent `null + 1 === 1` scenario from occurring in `setImageClasses()`.
                className={`gallery-modal__image ${activeCardIndex !== null &&
                  setImageClasses(
                    activeCardIndex,
                    images.length,
                    index,
                    lastNavigationDirection
                  )}`}
                key={index}
              >
                <Img fixed={image.node.childImageSharp.fixed} />
                {imageMetadata[imageName] && imageMetadata[imageName].caption && (
                  <figcaption>{imageMetadata[imageName].caption}</figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    );
  }
);

export default GalleryModal;
