import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';

import Metadata from '../components/Metadata';

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
    <div className="container mx-auto px-4">
      <Metadata title="Welcome" />
      <div className="photo-gallery-index__cards flex flex-col md:flex-row md:flex-wrap items-center justify-center w-full mt-2 pb-5 pt-8">
        <div className="photo-gallery-index__card-container h-full sm:w-full">
          <Link
            className="photo-gallery-index__card observable is-visible has-entered relative hidden h-0 bg-white
              border-gray-400 shadow opacity-0 cursor-pointer w-full z-10"
            data-node-base={image.node.base}
            data-observer-root-margin="0px 0px 25%" // Best with bottom margin.
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
      <div className="global-editor mb-16 pb-1">
        <p>
          Hi, I'm Bronson Avila—an attorney-turned-developer residing in the State of
          Hawaii.
        </p>
        <p>
          I currently work remotely building websites and web applications for{' '}
          <a href="https://www.atlantic57.com/" rel="noopener noreferrer" target="_blank">
            Atlantic 57
          </a>
          , the consulting and creative division of{' '}
          <span className="italic">The Atlantic</span>. Some noteworthy organizations
          which I've had the pleasure to serve include the{' '}
          <a
            href="https://canceratlas.cancer.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            American Cancer Society
          </a>
          , the{' '}
          <a
            href="https://www.opengovpartnership.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Open Government Partnership
          </a>
          , and the{' '}
          <a
            href="https://www.uschamber.com/sbindex/"
            rel="noopener noreferrer"
            target="_blank"
          >
            United States Chamber of Commerce
          </a>
          .
        </p>
      </div>
    </div>
  );
};
