import React from 'react';
import Img from 'gatsby-image/withIEPolyfill';

import Caret from '../../static/svg/circle-caret.svg';
import Close from '../../static/svg/circle-close.svg';

const GalleryModal = React.forwardRef(
  (
    { activeCardIndex, cardSize, handleClose, height, images, initialTransform, width },
    ref
  ) => (
    <div
      className="gallery-modal"
      ref={ref}
      style={{
        height: `${height}px`,
        width: `${width}px`,
        transform: initialTransform,
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
        <button className="gallery-modal__button--previous">
          <Caret />
        </button>
        <button className="gallery-modal__button--next">
          <Caret />
        </button>

        {/* Images */}
        {images.map((image, index) => (
          <div
            className={`gallery-modal__image ${
              activeCardIndex === index ? 'is-visible' : ''
            }`}
            key={index}
          >
            <Img fixed={image.node.childImageSharp.fixed} />
          </div>
        ))}
      </div>
    </div>
  )
);

export default GalleryModal;
