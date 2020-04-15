import React from 'react';
import Img from 'gatsby-image/withIEPolyfill';

import Close from '../../static/svg/close.svg';

const GalleryModal = React.forwardRef(
  (
    { activeCardIndex, cardSize, handleClose, height, images, initialTransform, width },
    ref
  ) => (
    <div
      className="gallery__modal"
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
        <button className="gallery__modal-close" onClick={handleClose}>
          <Close className="fill-current h-6 w-6 m-2" />
        </button>

        {images.map((image, index) => (
          <div
            className={`gallery__modal-image ${
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
