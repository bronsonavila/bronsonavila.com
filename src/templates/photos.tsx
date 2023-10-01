import { graphql, Link } from 'gatsby'
import getTransformMatrixArray from 'utils/getTransformMatrixArray'
import Img from 'gatsby-image'
import lazyLoad from 'utils/lazyLoad'
import Metadata from 'components/Metadata'
import moveElementsRelativeToMouse from 'utils/moveElementsRelativeToMouse'
import PhotoGalleryModal from 'components/PhotoGalleryModal'
import React, { FC, Fragment, useCallback, useEffect, useRef, useState } from 'react'

// Constants

const DELAY = 300 // For animations and transitions.

// Types

type GalleryEdge = { next: GalleryItem; node: GalleryItem; previous: GalleryItem }

type GalleryImage = { fluid: ImageFluid }

type GalleryItem = { featured_image: GalleryImage; slug: string; title: string }

type ImageFluid = {
  aspectRatio: number
  base64: string
  sizes: string
  src: string
  srcSet: string
  srcSetWebp: string
  srcWebp: string
}

export type NavigationDirection = 'next' | 'previous' | ''

type PhotosProps = {
  data: {
    allGalleries: { edges: GalleryEdge[] }
    cardImages: { nodes: { description: string; image: { fluid: ImageFluid }; title: string }[] }
    markdownRemark: { frontmatter: { description: string; subtitle: string; title: string }; html: string }
    metaImage: { nodes: { featured_image: { fixed: { src: string } } }[] }
    modalImages: { nodes: { description: string; image: { fluid: ImageFluid }; title: string }[] }
  }
  location: { pathname: string }
}

// Components

const Photos: FC<PhotosProps> = ({ data, location }) => {
  const allGalleries = data.allGalleries.edges
  const cardImages = data.cardImages.nodes
  const content = data.markdownRemark
  const metaImage = data.metaImage.nodes[0].featured_image
  const modalImages = data.modalImages.nodes

  const [activeCard, setActiveCard] = useState<HTMLElement | null>(null)
  const [galleryNext, setGalleryNext] = useState<GalleryItem | null>(null)
  const [galleryPrevious, setGalleryPrevious] = useState<GalleryItem | null>(null)
  const [isThrottled, setIsThrottled] = useState(false)
  const [lastInnerDimensions, setLastInnerDimensions] = useState(
    typeof window !== 'undefined' ? { height: window.innerHeight, width: window.innerWidth } : null
  )
  const [lastKeyboardEvent, setLastKeyboardEvent] = useState<KeyboardEvent | null>(null)
  const [lastNavigationDirection, setLastNavigationDirection] = useState<NavigationDirection>('')
  const [modalHasSmoothTransition, setModalHasSmoothTransition] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalWidth, setModalWidth] = useState<number | null>(null)

  const cardRefs = cardImages.map(() => useRef<HTMLDivElement | null>(null))
  const modalRef = useRef<HTMLDivElement | null>(null)
  const photoGalleryRef = useRef<HTMLElement | null>(null)

  // Functions

  // Moves the modal over a gallery card, and expands the modal to reveal the full image.
  // See: https://www.freecodecamp.org/news/animating-height-the-right-way/
  const animateModal = () => {
    const modal = modalRef.current
    const photoGallery = photoGalleryRef.current

    if (!modal || !photoGallery || !activeCard) return

    const modalImagesContainer = modal.childNodes[0] as HTMLElement
    const activeCardX = activeCard.offsetLeft - modal.offsetWidth / 2 + activeCard.offsetWidth / 2
    const activeCardY = activeCard.offsetTop - modal.offsetHeight / 2 + activeCard.offsetHeight / 2

    // Immediately move the modal over `activeCard`, and scale the modal down to `activeCard` size.
    modal.style.opacity = '1'
    modal.style.transform = `
        translate(${activeCardX}px, ${activeCardY}px)
        scaleX(${activeCard.offsetWidth / modal.offsetWidth})
        scaleY(${activeCard.offsetHeight / modal.offsetHeight})`
    modalImagesContainer.style.transform = `
        scaleX(${modal.offsetWidth / activeCard.offsetWidth})
        scaleY(${modal.offsetHeight / activeCard.offsetHeight})`

    // Smoothly move the modal to the center of the screen and expand it to its full size.
    setTimeout(() => {
      const centerX = document.body.offsetWidth / 2 - modal.offsetWidth / 2
      const centerY =
        document.body.offsetHeight / 2 -
        modal.offsetHeight / 2 -
        photoGallery.getBoundingClientRect().top / 2 +
        window.scrollY / 2 -
        33.5 // Necessary offset (basis for calculation unknown).

      // `scale` ensures the modal height does not exceed the screen height.
      const scale = modal.offsetHeight + 45 > window.innerHeight ? window.innerHeight / (modal.offsetHeight + 45) : 1

      setModalIsOpen(true)

      modal.style.transform = `translate(${centerX}px, ${centerY}px) scale(${scale})`
      modalImagesContainer.style.transform = 'scale(1)'
    }, DELAY * 2)
  }

  // Navigates to the next/previous image in the modal. Wraps to the start or end based on the `activeCard` position.
  const changeModalImage = (direction: NavigationDirection) => {
    if (!activeCard) return

    const activeCardIndex = Number(activeCard.dataset.index)
    let index: number | undefined

    if (direction === 'next') {
      index = activeCardIndex === cardRefs.length - 1 ? 0 : activeCardIndex + 1
    } else if (direction === 'previous') {
      index = activeCardIndex === 0 ? cardRefs.length - 1 : activeCardIndex - 1
    }

    if (index !== undefined) {
      setActiveCard(cardRefs[index].current)
    }
  }

  const closeModal = () => {
    setModalHasSmoothTransition(false)
    resetModal()
  }

  // Sequentially reveal image cards. Uses `display: none` initially, then staggers visibility for `lazyLoad` detection.
  const displayPhotoGalleryCards = () => {
    const observables = [...document.querySelectorAll('.observable')]

    observables.forEach((observable, index) => {
      // Must be triggered before `lazyLoad` callback runs.
      setTimeout(() => observable.classList.add('is-visible'), (index * DELAY) / 3.666)
    })
  }

  // Handles navigation of the modal via keyboard
  const handleModalKeyboardNavigation = () => {
    if (!lastKeyboardEvent) return

    let direction: NavigationDirection = ''

    if (lastKeyboardEvent.key === 'ArrowLeft') {
      direction = 'previous'
    } else if (lastKeyboardEvent.key === 'ArrowRight') {
      direction = 'next'
    } else if (lastKeyboardEvent.key === 'Escape') {
      setModalHasSmoothTransition(false)
      resetModal()
    }

    if (direction) {
      setModalHasSmoothTransition(true)
      changeModalImage(direction)
      setLastNavigationDirection(direction) // Prevents unnecessary modal animation.
    }
  }

  // Handles navigation of the modal via the next/previous buttons.
  const handleModalButtonNavigation = (direction: NavigationDirection) => {
    if (isThrottled) return

    handleThrottle()

    // Smooth transition with next/previous buttons or left/right arrows. Transition immediately on gallery card click.
    setModalHasSmoothTransition(true)

    changeModalImage(direction)
    setLastNavigationDirection(direction)
  }

  // Sets the width of the modal based on the window width.
  const handleModalResize = useCallback(() => {
    const { width } = lastInnerDimensions || {}

    if (!width) return

    if (width >= 1024) {
      setModalWidth(931) // 2px wider than `$image-width--lg` in `src/styles/gallery.scss`.
    } else if (width >= 768) {
      setModalWidth(740)
    } else if (width >= 640) {
      setModalWidth(612)
    } else {
      setModalWidth(width - 28)
    }
  }, [lastInnerDimensions?.width])

  // Throttles gallery navigation via next/previous buttons and left/right arrows.
  const handleThrottle = () => {
    setIsThrottled(true)
    setTimeout(() => setIsThrottled(false), DELAY * 1.25)
  }

  // Slides the modal out of view before moving it back to its default position.
  const resetModal = () => {
    const modal = modalRef.current

    if (!modal) return

    const transformMatrixArray = getTransformMatrixArray(modal)

    if (!transformMatrixArray) return

    const x = transformMatrixArray[4]
    const y = Number(transformMatrixArray[5])

    modal.style.opacity = '0'
    modal.style.transform = `translate(${x}px, ${y + window.innerHeight}px)`

    setTimeout(() => {
      setActiveCard(null)
      setModalIsOpen(false)
      modal.style.transform = ''
    }, DELAY)
  }

  // Sets the appropriate navigation links for next/previous photo galleries.
  const setGalleriesState = () => {
    const currentGalleryTitle = content.frontmatter.title
    const galleryCurrent = allGalleries.find(gallery => gallery.node.title === currentGalleryTitle)

    if (!galleryCurrent) return

    setGalleryNext(galleryCurrent.next ?? allGalleries[0].node)
    setGalleryPrevious(galleryCurrent.previous ?? allGalleries[allGalleries.length - 1].node)
  }

  // Effects

  // Animate the entrance of gallery cards when the page loads. Apply lazy loading. Animate gallery cards on hover.
  useEffect(() => {
    setTimeout(() => {
      displayPhotoGalleryCards()

      lazyLoad((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('has-entered'), DELAY / 3)
          }
        })
      })

      moveElementsRelativeToMouse({
        additionalTransformValues: 'scale(1.025)',
        containerSelector: '.photo-gallery__card-container'
      })
    }, DELAY)
  })

  // Animate the modal when a gallery card is clicked.
  useEffect(() => {
    // Only animate when user clicks a gallery card, not when presses next/previous buttons or left/right arrow keys.
    if (lastNavigationDirection !== 'next' && lastNavigationDirection !== 'previous') {
      animateModal()
    }
  }, [activeCard, lastNavigationDirection])

  // Track keyboard events.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => setLastKeyboardEvent(event)

    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Handle keyboard navigation.
  useEffect(() => {
    if (isThrottled) return

    handleThrottle()
    handleModalKeyboardNavigation()
  }, [lastKeyboardEvent])

  // Set the next/previous photo galleries.
  useEffect(() => {
    setGalleriesState()
  }, [allGalleries, content])

  // Track window dimensions.
  useEffect(() => {
    const onResize = () => setLastInnerDimensions({ height: window.innerHeight, width: window.innerWidth })

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Resize and reset the modal when the window is resized.
  useEffect(() => {
    handleModalResize()
    closeModal()
  }, [lastInnerDimensions])

  // Render

  return (
    <>
      <Metadata
        description={content.frontmatter.description}
        image={`https:${metaImage.fixed.src}`} // Contentful CDN URLs are prepended with two slashes.
        pathname={location.pathname}
        title={content.frontmatter.title}
      />

      <section className="photo-gallery" onClick={closeModal} ref={photoGalleryRef}>
        <div className="container mx-auto px-4">
          <h1 className="text-center mb-16 pb-1 pt-8">{content.frontmatter.title}</h1>

          <div className="global-editor mb-16 pb-1">
            <p className="text-center">{content.frontmatter.subtitle}</p>
          </div>

          <div className="photo-gallery__cards flex flex-wrap justify-between w-full mb-6">
            {modalWidth && modalRef && (
              <PhotoGalleryModal
                activeCardIndex={activeCard && Number(activeCard.dataset.index)}
                handleClose={closeModal}
                handleNextImage={() => handleModalButtonNavigation('next')}
                handlePreviousImage={() => handleModalButtonNavigation('previous')}
                hasSmoothTransition={modalHasSmoothTransition}
                height={modalWidth * (2 / 3)} // Supports images with a 3:2 aspect ratio ONLY.
                images={modalImages}
                isOpen={modalIsOpen}
                lastNavigationDirection={lastNavigationDirection}
                ref={modalRef}
                width={modalWidth}
              />
            )}

            {cardImages.map((image, index) => (
              <div className="photo-gallery__card-container h-full sm:w-full" key={index}>
                <div
                  className="photo-gallery__card observable relative hidden h-0 bg-white
                    border border-gray-400 shadow opacity-0 cursor-pointer w-full z-10"
                  data-index={index}
                  data-observer-root-margin="0px 0px 25%" // Best with 25% bottom margin.
                  onClick={event => {
                    if (!isThrottled) {
                      event.stopPropagation()
                      handleThrottle()
                      setModalHasSmoothTransition(false)
                      setActiveCard(cardRefs[index].current)
                      setLastNavigationDirection('')
                    }
                  }}
                  onMouseDown={() => cardRefs[index].current?.removeAttribute('style')}
                  ref={cardRefs[index]}
                >
                  <Img className="h-full w-full" fluid={image.image.fluid} />
                </div>
              </div>
            ))}
          </div>

          {galleryNext && galleryPrevious && (
            <div
              className="photo-gallery-navigation observable hidden h-0 mb-20 md:mb-16 md:pb-3 lg:pb-0
                transition duration-300 ease-in-out opacity-0"
              data-observer-root-margin="0px 0px 25%"
            >
              <h3 className="text-center mb-12 mt-16 md:mt-14 lg:mt-10">More Photos</h3>

              <div className="photo-gallery-navigation__cards flex items-center justify-between sm:justify-center w-full">
                {[galleryPrevious, galleryNext].map(({ featured_image, slug, title }, index) => (
                  <Fragment key={index}>
                    <div
                      className={`photo-gallery-navigation__card-container h-full sm:w-full ${
                        index !== 0 ? 'sm:ml-9 md:ml-11 lg:ml-14' : ''
                      }`}
                    >
                      <Link
                        className="photo-gallery-navigation__card observable relative hidden h-0 bg-white
                          border-gray-400 shadow opacity-0 cursor-pointer w-full z-10"
                        data-observer-root-margin="0px 0px 25%"
                        to={`/photos/${slug}/`}
                      >
                        <Img className="h-full w-full" fluid={featured_image.fluid} />

                        <p className="photo-gallery-navigation__card-label absolute whitespace-pre mt-10 hover:text-gray-600">
                          {title}
                        </p>
                      </Link>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// `quality: 91` appears to offer the best file size reduction for JPEGs without any
// noticeable loss in image quality. The `maxWidth` of images should be 2px smaller
// than the `modalWidth` value to account for a 1px border.
export const query = graphql`
  query($slug: String!, $title: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        description
        subtitle
        title
      }
      html
    }
    allGalleries: allContentfulGallery(sort: { order: ASC, fields: title }) {
      edges {
        next {
          featured_image {
            fluid(maxWidth: 273, quality: 91) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
          slug
          title
        }
        node {
          featured_image {
            fluid(maxWidth: 273, quality: 91) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
          slug
          title
        }
        previous {
          featured_image {
            fluid(maxWidth: 273, quality: 91) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
          slug
          title
        }
      }
    }
    metaImage: allContentfulGallery(filter: { title: { eq: $title } }) {
      nodes {
        featured_image {
          fixed(width: 1200, quality: 91) {
            src
          }
        }
      }
    }
    cardImages: allContentfulGalleryImage(
      filter: { gallery: { title: { eq: $title } } }
      sort: { order: ASC, fields: title }
    ) {
      nodes {
        description
        image {
          fluid(maxWidth: 273, quality: 91) {
            ...GatsbyContentfulFluid_withWebp
          }
        }
        title
      }
    }
    modalImages: allContentfulGalleryImage(
      filter: { gallery: { title: { eq: $title } } }
      sort: { order: ASC, fields: title }
    ) {
      nodes {
        description
        image {
          fluid(maxWidth: 929, quality: 91) {
            ...GatsbyContentfulFluid_withWebp
          }
        }
        title
      }
    }
  }
`

export default Photos
