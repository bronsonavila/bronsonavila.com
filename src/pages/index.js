import { graphql, Link, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import React, { useEffect, useState } from 'react';
import posed from 'react-pose';

import ExternalLink from 'components/ExternalLink';
import Metadata from 'components/Metadata';

const duration = 850;

const PosedDiv = posed.div({
  visible: { staggerChildren: duration / 2 },
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
          pose={isLoaded ? 'visible' : 'hidden'}
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
        <PosedDivChild
          className="global-editor mb-8 pb-1 opacity-0"
          pose={isLoaded ? 'visible' : 'hidden'}
        >
          <h1 className="font-normal text-base tracking-normal leading-relaxed">
            Hey, I'm Bronson Avila — an attorney-turned-software engineer specializing in
            front-end development of web applications.
          </h1>
          <p>
            I currently reside in Hawaii and work remotely as a front-end engineer at{' '}
            <ExternalLink href="https://www.tryklarity.com/" text="Klarity" /> — an
            automated contract review solution for accounting and finance teams.
          </p>
          <p>
            My prior experience includes working as a software engineer at{' '}
            <ExternalLink href="https://www.meetbbot.com/" text="Bbot" /> — a mobile
            ordering platform for the hospitality industry. I also previously developed
            websites and web applications for clients of{' '}
            <ExternalLink href="https://www.longdash.co/" text="Long Dash" />, which
            include the{' '}
            <ExternalLink
              href="https://canceratlas.cancer.org/"
              text="American Cancer Society"
            />
            , the{' '}
            <ExternalLink
              href="https://www.opengovpartnership.org/"
              text="Open Government Partnership"
            />
            , and the{' '}
            <ExternalLink
              href="https://www.splcenter.org/"
              text="Southern Poverty Law Center"
            />
            .
          </p>
        </PosedDivChild>
      </PosedDiv>
    </>
  );
};
