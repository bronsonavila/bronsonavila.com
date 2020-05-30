import React from 'react';
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
  const data = useStaticQuery(
    graphql`
      query {
        allFile(filter: { base: { eq: "bronson-avila.jpg" } }) {
          edges {
            node {
              base
              childImageSharp {
                fluid(maxWidth: 929, quality: 91) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    `
  );

  const image = data.allFile.edges[0];

  return (
    <>
      <Metadata title="Welcome" />
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
        {/* Text */}
        <PosedText
          className="global-editor mb-8 pb-1"
          initialPose="hidden"
          pose="visible"
        >
          <p>
            Hi, I'm Bronson Avila—an attorney-turned-software developer residing in
            Hawaii.
          </p>
          <p>
            I currently develop websites and web applications for clients of{' '}
            <ExternalLink text="Atlantic 57" url="https://www.atlantic57.com/" />, the
            consulting and creative division of{' '}
            <span className="italic">The Atlantic</span>. My work has reached
            organizations such as the{' '}
            <ExternalLink
              text="American Cancer Society"
              url="https://canceratlas.cancer.org/"
            />
            , the{' '}
            <ExternalLink
              text="Open Government Partnership"
              url="https://www.opengovpartnership.org/"
            />
            , and the{' '}
            <ExternalLink
              text="United States Chamber of Commerce"
              url="https://www.uschamber.com/sbindex/"
            />
            .
          </p>
          <p>
            If you have a passion for finding technical solutions to civic-minded
            problems, or are interested in the intersection between law and technology,
            I'd love to chat. Feel free to learn more{' '}
            <Link className="text-gray-900 hover:gray-600" to="/about/">
              about
            </Link>{' '}
            me, browse some{' '}
            <Link className="text-gray-900 hover:gray-600" to="/photos/">
              photos
            </Link>
            , or get in{' '}
            <Link className="text-gray-900 hover:gray-600" to="/contact/">
              contact
            </Link>
            . Thanks for visiting.
          </p>
        </PosedText>
      </div>
    </>
  );
};
