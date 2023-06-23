import { graphql, Link, useStaticQuery } from 'gatsby'
import Img, { FluidObject } from 'gatsby-image'
import lazyLoad from 'utils/lazyLoad'
import Metadata from 'components/Metadata'
import React, { useEffect, useRef } from 'react'

// Types

type GalleryNode = {
  title: string
  slug: string
  featured_image: {
    fluid: FluidObject
    title: string
  }
}

type QueryData = {
  galleries: {
    nodes: GalleryNode[]
  }
}

// Constants

const DELAY = 300

// Functions

const displayCards = (): void => {
  const cards = [...document.querySelectorAll('.observable')]

  cards.forEach((card, index) => {
    setTimeout(() => card.classList.add('is-visible'), (index * DELAY) / 3.666) // Must trigger before `setObserverCallback` runs.
  })
}

const animateCards = (delay: number) => (entries: IntersectionObserverEntry[]): void => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('has-entered'), delay / 3)
    }
  })
}

// Component

const PhotosPage = ({ location }: { location: Location }): JSX.Element => {
  const data = useStaticQuery<QueryData>(
    graphql`
      query {
        galleries: allContentfulGallery(sort: { order: ASC, fields: title }) {
          nodes {
            title
            slug
            featured_image {
              fluid(maxWidth: 273, quality: 91) {
                ...GatsbyContentfulFluid_withWebp
              }
              title
            }
          }
        }
      }
    `
  )

  const galleries: GalleryNode[] = data.galleries.nodes

  const cardRefs = galleries.map(() => useRef<HTMLDivElement>(null))

  useEffect(() => {
    const timer = setTimeout(() => {
      displayCards()
      lazyLoad(animateCards(DELAY))
    }, DELAY)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto px-4">
      <Metadata description="Photos by Bronson Avila" pathname={location.pathname} title="Photos" />

      <h1 className="text-center mb-20 pb-3 pt-8">Photos</h1>

      <div className="photo-gallery-index__cards flex flex-col md:flex-row md:flex-wrap items-center justify-between w-full">
        {galleries.map((gallery, index) => (
          <React.Fragment key={gallery.slug}>
            <div className="photo-gallery-index__card-container h-full sm:w-full" ref={cardRefs[index]}>
              <Link
                className="photo-gallery-index__card observable relative hidden h-0 bg-white
                  border-gray-400 shadow opacity-0 cursor-pointer w-full z-10"
                data-observer-root-margin="0px 0px 25%" // Best with bottom margin.
                to={`/photos/${gallery.slug}/`}
              >
                <Img
                  alt={gallery.featured_image.title}
                  className="h-full w-full"
                  fluid={gallery.featured_image.fluid}
                />

                <p className="photo-gallery-index__card-label absolute whitespace-pre mt-10 hover:text-gray-600">
                  {gallery.title}
                </p>
              </Link>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default PhotosPage
