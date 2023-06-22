import { graphql, Link, PageProps, useStaticQuery } from 'gatsby'
import Img, { FluidObject } from 'gatsby-image'
import Metadata from 'components/Metadata'
import posed from 'react-pose'
import React, { FC, useEffect, useState } from 'react'

// Types

type HomePageProps = PageProps & {
  location: {
    pathname: string
  }
}

type HomePageQueryData = {
  image: {
    nodes: {
      title: string
      fluid: FluidObject
    }[]
  }
}

type PhotoCardLinkProps = {
  alt: string
  fluid: FluidObject
  to: string
}

// Constants

const DURATION = 850

const HOME_PAGE_QUERY = graphql`
  query {
    image: allContentfulAsset(filter: { file: { fileName: { eq: "bronson-avila.jpg" } } }) {
      nodes {
        title
        fluid(maxWidth: 273, quality: 91) {
          ...GatsbyContentfulFluid_withWebp
        }
      }
    }
  }
`

// Components

const AnimatedContainer = posed.div({
  visible: { staggerChildren: DURATION / 3 } // Divide by number of children.
})

const AnimatedElement = posed.div({
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } },
  hidden: { y: 50, opacity: 0 }
})

const PhotoCardLink: React.FC<PhotoCardLinkProps> = ({ alt, fluid, to }) => (
  <div className="photo-gallery-index__card-container--single h-full sm:w-full">
    <Link
      className="photo-gallery-index__card observable is-visible has-entered relative hidden h-0 bg-white
      border-gray-400 shadow opacity-0 cursor-pointer w-full z-10"
      to={to}
    >
      <Img alt={alt} className="h-full w-full" fluid={fluid} />
    </Link>
  </div>
)

const HomePage: FC<HomePageProps> = ({ location }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const data = useStaticQuery(HOME_PAGE_QUERY) as HomePageQueryData

  const image = data.image.nodes[0]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <>
      <Metadata pathname={location.pathname} />

      <AnimatedContainer className="container mx-auto px-4" pose={isLoaded ? 'visible' : 'hidden'}>
        <AnimatedElement
          className="photo-gallery-index__cards flex flex-col md:flex-row md:flex-wrap items-center justify-center
            w-full mt-2 pb-5 pt-8 opacity-0"
        >
          <PhotoCardLink alt={image.title} fluid={image.fluid} to="/about/" />
        </AnimatedElement>

        <AnimatedElement className="global-editor opacity-0">
          <h1 className="font-normal text-base tracking-normal leading-relaxed">
            Hi, I'm Bronson – an attorney-turned-software engineer specializing in the front-end development of websites
            and web applications in fully remote roles.
          </h1>
        </AnimatedElement>

        <AnimatedElement className="global-editor mb-8 pb-1 opacity-0">
          <p>
            I take a disciplined approach in my work at the intersection of technology, design, and user experience to
            create polished, accessible, and quality-driven products.
          </p>
        </AnimatedElement>
      </AnimatedContainer>
    </>
  )
}

export default HomePage
