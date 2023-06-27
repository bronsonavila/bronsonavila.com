import { FluidObject } from 'gatsby-image'
import React, { FC, forwardRef, MouseEvent, ReactElement, TouchEvent, useState } from 'react'
import Caret from 'src/../static/svg/circle-caret.svg'
import Close from 'src/../static/svg/circle-close.svg'
import Img from 'gatsby-image'

// Types

type GalleryProps = {
  activeCardIndex: number | null
  handleNextImage: () => void
  handlePreviousImage: () => void
  handleClose: () => void
  hasSmoothTransition: boolean
  height: number
  images: ImageProps[]
  isOpen: boolean
  lastNavigationDirection: 'next' | 'previous'
  width: number
}

type ImageProps = {
  image: {
    fluid: FluidObject
  }
  description?: string
}

type NavigationButtonProps = {
  label: string
  classes: string
  onClick: () => void
  icon: ReactElement
  isHovered: boolean
}

// Components

const PhotoGalleryModal = forwardRef<HTMLDivElement, GalleryProps>(
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
    const [isHovered, setIsHovered] = useState<boolean>(false)

    /**
     * Defines image classes for display and animation purposes. Leverages `lastNavigationDirection`
     * to apply `.will-fade-in` class for next/previous actions, which results in smooth fading transitions.
     *
     * Note: Initial next/previous actions do not trigger fading. While attempts were made to use `setTimeout`
     * to delay the application of `.will-fade-in` for smoother transitions, it adversely affected performance.
     */
    const setImageClasses = (index: number): string => {
      // Prevent scenario where `null + 1 === 1` is `true`.
      if (activeCardIndex !== null) {
        const isNext = index === activeCardIndex + 1 || (index === 0 && activeCardIndex === images.length - 1)
        const isPrevious = index === activeCardIndex - 1 || (activeCardIndex === 0 && index === images.length - 1)

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

    const modalStateClasses = `${hasSmoothTransition ? 'has-smooth-transition ' : ''}${isHovered ? 'is-hovered ' : ''}${
      isOpen ? 'is-open ' : ''
    }`

    return (
      <div
        className={`photo-gallery-modal absolute top-0 left-0 bg-white border border-gray-400 overflow-hidden shadow-2xl z-20 ${modalStateClasses}`}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={(e: TouchEvent<HTMLDivElement>) => {
          const nodeName = (e.target as Node).nodeName
          if (nodeName === 'IMG' || nodeName === 'FIGCAPTION') setIsHovered(!isHovered) // Only toggle overlay when elements other than SVG icons/buttons are tapped.
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
          <NavigationButton
            label="Close modal"
            classes="photo-gallery-modal__button--close absolute top-0 right-0 text-red-800 transition-all duration-300 ease-in-out opacity-0 z-10 focus:text-red-700 focus:outline-none hover:text-red-700 hover:outline-none"
            onClick={handleClose}
            icon={<Close />}
            isHovered={isHovered}
          />

          <NavigationButton
            label="Previous image"
            classes="photo-gallery-modal__button--previous absolute left-0 text-gray-900 transition-all duration-300 ease-in-out opacity-0 z-10 focus:text-gray-600 focus:outline-none hover:text-gray-600 hover:outline-none"
            onClick={handlePreviousImage}
            icon={<Caret />}
            isHovered={isHovered}
          />

          <NavigationButton
            label="Next image"
            classes="photo-gallery-modal__button--next absolute right-0 text-gray-900 transition-all duration-300 ease-in-out opacity-0 z-10 focus:text-gray-600 focus:outline-none hover:text-gray-600 hover:outline-none"
            onClick={handleNextImage}
            icon={<Caret />}
            isHovered={isHovered}
          />

          {images.map((image, index) => (
            <figure
              className={`photo-gallery-modal__image hidden absolute top-0 w-full ${setImageClasses(index)}`}
              key={index}
            >
              <Img fluid={image.image.fluid} />
              {image.description && (
                <figcaption className="absolute bottom-0 text-sm md:text-base text-white leading-relaxed tracking-tighter transition-all duration-300 ease-in-out m-3 md:m-4 px-6 md:px-8 py-4 md:py-6 opacity-0 w-full">
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

PhotoGalleryModal.displayName = 'PhotoGalleryModal'

const NavigationButton: FC<NavigationButtonProps> = ({ label, classes, onClick, icon, isHovered }) => (
  <button aria-label={label} className={classes} onClick={onClick} tabIndex={isHovered ? 0 : -1}>
    {icon}
  </button>
)

export default PhotoGalleryModal
