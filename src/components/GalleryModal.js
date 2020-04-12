import React from 'react';
import Img from 'gatsby-image/withIEPolyfill';

const GalleryModal = React.forwardRef(
  ({ activeCardIndex, cardSize, height, images, width }, ref) => (
    <div
      className="gallery__modal"
      ref={ref}
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      <div
        className="relative overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: `${height}px` }}
      >
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