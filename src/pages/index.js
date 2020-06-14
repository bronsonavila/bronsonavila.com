import React, { useEffect, useState } from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import posed from 'react-pose';

import ExternalLink from '../components/ExternalLink';
import Metadata from '../components/Metadata';

const PosedText = posed.div({
  visible: { y: 0, opacity: 1, delay: 350, transition: { ease: 'easeOut' } },
  hidden: { y: 50, opacity: 0 },
});

export default () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const data = useStaticQuery(
    graphql`
      query {
        allFile(filter: { base: { eq: "bronson-avila.jpg" } }) {
          edges {
            node {
              base
              childImageSharp {
                fluid(maxWidth: 273, quality: 91) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    `
  );

  const image = data.allFile.edges[0];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Metadata />
      <div className="container mx-auto px-4">
        {/* Image */}
        <div className="photo-gallery-index__cards flex flex-col md:flex-row md:flex-wrap items-center justify-center w-full mt-2 pb-5 pt-8">
          <div className="photo-gallery-index__card-container--single h-full sm:w-full">
            <Link
              className="photo-gallery-index__card observable is-visible has-entered relative hidden h-0 bg-white
                border-gray-400 shadow opacity-0 cursor-pointer w-full z-10"
              to="/about/"
            >
              <Img
                alt={image.node.base.split('.')[0]}
                className="h-full w-full"
                fluid={image.node.childImageSharp.fluid}
              />
            </Link>
          </div>
        </div>
        <PosedText
          className="global-editor mb-8 pb-1 opacity-0"
          pose={isLoaded ? 'visible' : 'hidden'}
        >
          <h1 className="font-normal text-base tracking-normal leading-relaxed">
            Hi, I'm Bronson Avila—an attorney-turned-software developer residing in
            Hawaii.
          </h1>
          <p>
            I currently develop websites and web applications for clients of{' '}
            <ExternalLink href="https://www.atlantic57.com/" text="Atlantic 57" />, the
            consulting and creative division of{' '}
            <span className="italic">The Atlantic</span>. My work has reached
            organizations such as the{' '}
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
              href="https://www.uschamber.com/sbindex/"
              text="U.S. Chamber of Commerce"
            />
            .
          </p>
          <p>
            If you have a passion for finding technical solutions to civic-minded
            problems, or are interested in the intersection of law and technology, I'd
            love to chat.
          </p>
        </PosedText>
      </div>
    </>
  );
};
