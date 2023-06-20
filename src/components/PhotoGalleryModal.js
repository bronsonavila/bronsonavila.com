import Caret from 'src/../static/svg/circle-caret.svg'
import Close from 'src/../static/svg/circle-close.svg'
import Img from 'gatsby-image'
import React, { useState } from 'react'

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
 * @return {String}
 */
const setImageClasses = (activeCardIndex, imagesLength, index, lastNavigationDirection) => {
  // Prevent scenario where `null + 1 === 1` is `true`.
  if (activeCardIndex !== null) {
    const isNext = index === activeCardIndex + 1 || (index === 0 && activeCardIndex === imagesLength - 1)
    const isPrevious = index === activeCardIndex - 1 || (activeCardIndex === 0 && index === imagesLength - 1)

    if (activeCardIndex === index) {
      return 'is-displayed'
    } else if (isNext) {
      return `is-next ${lastNavigationDirection === 'next' ? 'will-fade-in' : ''}`
    } else if (isPrevious) {
      return `is-previous ${lastNavigationDirection === 'previous' ? 'will-fade-in' : ''}`
    }
  }
  return ''
}

/**
 * Photo Gallery Modal
 *
 * Modal displayed within the the `photos` template.
 *
 * @param {Integer} activeCardIndex
 * @param {Function} handleNextImage
 * @param {Function} handlePreviousImage
 * @param {Function} handleClose
 * @param {Boolean} hasSmoothTransition
 * @param {Integer} height
 * @param {Object[]} images
 * @param {Boolean} isOpen
 * @param {String} lastNavigationDirection
 * @param {Object} ref
 * @param {Integer} width
 */
const PhotoGalleryModal = React.forwardRef(
  (
    {
      activeCardIndex,
      handleNextImage,
      handlePreviousImage,
      handleClose,
      hasSmoothTransition,
      height,
      images,
      isOpen,
      lastNavigationDirection,
      width
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(null)
    const modalStateClasses =
      `${hasSmoothTransition ? 'has-smooth-transition ' : ''}` +
      `${isHovered ? 'is-hovered ' : ''}` +
      `${isOpen ? 'is-open ' : ''}`

    return (
      <div // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        className={
          `photo-gallery-modal absolute top-0 left-0 bg-white border border-gray-400 ` +
          `overflow-hidden shadow-2xl z-20 ${modalStateClasses}`
        }
        onClick={e => e.stopPropagation()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={e => {
          const nodeName = e.target.nodeName
          // Only toggle overlay when elements other than SVG icons/buttons are tapped.
          if (nodeName === 'IMG' || nodeName === 'FIGCAPTION') setIsHovered(!isHovered)
        }}
        ref={ref}
        style={{
          height: `${height}px`,
          width: `${width}px`
        }}
      >
        <div
          className="relative overflow-hidden transition-all duration-300 ease-in-out"
          style={{ height: `${height}px` }}
        >
          {/* Buttons */}
          <button
            aria-label="Close modal"
            className="photo-gallery-modal__button--close absolute top-0 right-0 text-red-800
              transition-all duration-300 ease-in-out opacity-0 z-10
              focus:text-red-700 focus:outline-none hover:text-red-700 hover:outline-none"
            onClick={handleClose}
            tabIndex={isHovered ? 0 : -1}
          >
            <Close />
          </button>
          <button
            aria-label="Previous image"
            className="photo-gallery-modal__button--previous absolute left-0 text-gray-900
              transition-all duration-300 ease-in-out opacity-0 z-10
              focus:text-gray-600 focus:outline-none hover:text-gray-600 hover:outline-none"
            onClick={handlePreviousImage}
            tabIndex={isHovered ? 0 : -1}
          >
            <Caret />
          </button>
          <button
            aria-label="Next image"
            className="photo-gallery-modal__button--next absolute right-0 text-gray-900
              transition-all duration-300 ease-in-out opacity-0 z-10
              focus:text-gray-600 focus:outline-none hover:text-gray-600 hover:outline-none"
            onClick={handleNextImage}
            tabIndex={isHovered ? 0 : -1}
          >
            <Caret />
          </button>

          {/* Images */}
          {images.map((image, index) => (
            <figure
              className={
                `photo-gallery-modal__image hidden absolute top-0 w-full ` +
                `${setImageClasses(activeCardIndex, images.length, index, lastNavigationDirection)}`
              }
              key={index}
            >
              <Img fluid={image.image.fluid} />
              {image.description && (
                <figcaption
                  className="absolute bottom-0 text-sm md:text-base text-white
                    leading-relaxed tracking-tighter transition-all duration-300 ease-in-out
                    m-3 md:m-4 px-6 md:px-8 py-4 md:py-6 opacity-0 w-full"
                >
                  {image.description}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    )
  }
)

export default PhotoGalleryModal
