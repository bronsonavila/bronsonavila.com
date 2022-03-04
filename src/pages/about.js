import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';
import posed from 'react-pose';

import ExternalLink from 'components/ExternalLink';
import Metadata from 'components/Metadata';

const duration = 350;

const PosedDiv = posed.div({
  visible: { staggerChildren: duration / 3 },
});

const PosedDivChild = posed.div({
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } },
  hidden: { y: 50, opacity: 0 },
});

export default ({ location }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), duration);
  }, []);

  return (
    <>
      <Metadata
        description="About Bronson Avila"
        pathname={location.pathname}
        title="About"
      />
      <div className="container mx-auto px-4">
        <h1 className="text-center mb-16 pb-1 pt-8">About</h1>
        <div className="global-editor mb-8 pb-1">
          <p>
            For an outline of my experience and education, please refer to my{' '}
            <ExternalLink
              href="https://www.linkedin.com/in/bronsonavila/"
              text="LinkedIn"
            />{' '}
            profile. You can also find some of my pet projects and coding notes on{' '}
            <ExternalLink href="https://github.com/bronsonavila/" text="GitHub" />.
          </p>
          <PosedDiv pose={isLoaded ? 'visible' : 'hidden'}>
            <PosedDivChild>
              <h3 className="text-center mb-12 mt-16">Software Engineering</h3>
              <p>
                I have been developing websites and web applications as a hobbyist since
                2017 and professionally since 2018. I started self-teaching via online
                resources out of personal curiosity, and I soon joined a coding bootcamp
                to shift out of the legal profession.
              </p>
              <p>Why make the change?</p>
              <p>
                Software development is one of the greatest tools we have to empower
                ourselves, as it allows for unfettered creative expression and open access
                to information. By contrast, the American legal system is built upon rigid
                adherence to precedent rather than innovation, and the judicial process is
                often lacking in transparency. The environment can grow to be stifling for
                those seeking meaningful progress.
              </p>
              <p>
                My long-term goal is to use my knowledge of law and technology to improve
                access to legal information and increase the efficiency of government
                systems. Meanwhile, I continue learning as much as I can while helping
                good people do good work.
              </p>
            </PosedDivChild>
            <PosedDivChild>
              <h3 className="text-center mb-12 mt-16">Legal Experience</h3>
              <p>
                I previously worked as an attorney in criminal defense, plaintiff's civil
                rights litigation, and legislative research and analysis. Although I no
                longer actively practice law, I remain licensed in the State of Hawaii and
                the U.S. Ninth Circuit Court of Appeals.
              </p>
            </PosedDivChild>
            <PosedDivChild>
              <h3 className="text-center mb-12 mt-16">Open Invitation</h3>
              <p>
                Please feel free to <Link to="/contact/">contact</Link> me if you are
                interested in learning more about law or programming, or if you are
                considering a career change similar to my own.
              </p>
            </PosedDivChild>
          </PosedDiv>
        </div>
      </div>
    </>
  );
};
