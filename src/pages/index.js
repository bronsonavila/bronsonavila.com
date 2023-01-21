import { graphql, Link, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import React, { useEffect, useState } from 'react';
import posed from 'react-pose';

import Metadata from 'components/Metadata';

const duration = 850;

const PosedDiv = posed.div({
  visible: { staggerChildren: duration / 3 },
});

const PosedDivChild = posed.div({
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } },
  hidden: { y: 50, opacity: 0 },
});

export default ({ location }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const data = useStaticQuery(
    graphql`
      query {
        image: allContentfulAsset(
          filter: { file: { fileName: { eq: "bronson-avila.jpg" } } }
        ) {
          nodes {
            title
            fluid(maxWidth: 273, quality: 91) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
        }
      }
    `
  );

  const image = data.image.nodes[0];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Metadata pathname={location.pathname} />
      <PosedDiv className="container mx-auto px-4" pose={isLoaded ? 'visible' : 'hidden'}>
        <PosedDivChild
          className="photo-gallery-index__cards flex flex-col md:flex-row md:flex-wrap items-center justify-center
            w-full mt-2 pb-5 pt-8 opacity-0"
        >
          {/* Image */}
          <div className="photo-gallery-index__card-container--single h-full sm:w-full">
            <Link
              className="photo-gallery-index__card observable is-visible has-entered relative hidden h-0 bg-white
                border-gray-400 shadow opacity-0 cursor-pointer w-full z-10"
              to="/about/"
            >
              <Img alt={image.title} className="h-full w-full" fluid={image.fluid} />
            </Link>
          </div>
        </PosedDivChild>
        <PosedDivChild className="global-editor opacity-0">
          <h1 className="font-normal text-base tracking-normal leading-relaxed">
            Hi, I'm Bronson – an attorney-turned-software engineer specializing in the
            front-end development of websites and web applications in fully remote roles.
          </h1>
        </PosedDivChild>
        <PosedDivChild className="global-editor mb-8 pb-1 opacity-0">
          <p>
            Not much to see here, but feel free to browse around to learn more, check out
            some old photos, or shoot me a message.{' '}
            <span aria-label="Victory Hand emoji" role="img">
              ✌️
            </span>
          </p>
        </PosedDivChild>
      </PosedDiv>
    </>
  );
};
