import React, { useState } from 'react';
import Img from 'gatsby-image';

import Caret from '../../static/svg/circle-caret.svg';
import Close from '../../static/svg/circle-close.svg';

/**
 * Sets classes on each image to ensure appropriate display and animation.
 *
 * It is not aesthetically pleasing to have an image's opacity reduce to 0 while the
 * image slides out of view, as doing so results in excess whitespace that is harsh on
 * the eyes. Thus, when an image slides out of view, its opacity should remain at 100
 * for the duration of the animation. When an image slides into view, it should start
 * with its opacity at 0 and fade in to 100. This provides for a smoother experience.
 *
 * While the comment above describes what "should" happen, it has been difficult to
 * perfectly achieve this result. As a workaround, the `lastActiveCardSetter` is used to
 * apply the `.will-fade-in` class when the user successively clicks the "next" or
 * "previous" buttons. However, this means that the fading in will not always occur.
 *
 * An attempt was made to use `setTimeout` to apply `.will-fade-in` to each `.is-next` and
 * `.is-previous` element after a short delay. This did ensure that all images sliding in
 * would fade in, and that the image sliding out would not fade out. However, this usage
 * of `setTimeout` resulted in suboptimal performance and "chunky" transitions.
 *
 * Another alternative may be to apply `.will-fade-in` conditionally depending on whether
 * the user is hovering over the "next" or "previous" buttons. Perhaps...
 *
 * @param {Integer} activeCardIndex
 * @param {Integer} imagesLength - The total number of images in the gallery.
 * @param {Integer} index - The index of the current image in the map sequence.
 * @param {Node} lastActiveCardSetter - The last element to set the `activeCard`.
 */
const setImageClasses = (activeCardIndex, imagesLength, index, lastActiveCardSetter) => {
  const isNext =
    index === activeCardIndex + 1 ||
    (index === 0 && activeCardIndex === imagesLength - 1);
  const isPrevious =
    index === activeCardIndex - 1 ||
    (activeCardIndex === 0 && index === imagesLength - 1);

  if (activeCardIndex === index) {
    return 'is-displayed';
  } else if (isNext) {
    return `is-next ${lastActiveCardSetter.id === 'next' ? 'will-fade-in' : ''}`;
  } else if (isPrevious) {
    return `is-previous ${lastActiveCardSetter.id === 'previous' ? 'will-fade-in' : ''}`;
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
      lastActiveCardSetter,
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
          <button className="gallery-modal__button--close" onClick={handleClose}>
            <Close />
          </button>
          <button
            className="gallery-modal__button--previous"
            id="previous"
            onClick={handlePreviousImage}
          >
            <Caret />
          </button>
          <button
            className="gallery-modal__button--next"
            id="next"
            onClick={handleNextImage}
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
                    lastActiveCardSetter
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
