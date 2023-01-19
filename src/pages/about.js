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
          <PosedDiv pose={isLoaded ? 'visible' : 'hidden'}>
            <PosedDivChild>
              <p>
                I currently live in Hawaii working remotely as a front-end engineer at{' '}
                <ExternalLink href="https://www.tryklarity.com/" text="Klarity" /> – an
                automated contract review platform for accounting and finance teams.
              </p>
            </PosedDivChild>
            <PosedDivChild>
              <p>
                Previously employed as a software engineer at{' '}
                <ExternalLink href="https://www.meetbbot.com/" text="Bbot" /> prior to its
                acquisition by DoorDash, and also developed websites and web applications
                for clients of{' '}
                <ExternalLink href="https://www.longdash.co/" text="Long Dash" /> – which
                included working for organizations such as the{' '}
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
            <PosedDivChild>
              <p>
                For a deeper dive into my professional experience, check out my{' '}
                <ExternalLink
                  href="https://www.linkedin.com/in/bronsonavila/"
                  text="LinkedIn"
                />{' '}
                profile. Want to see some old toy projects and coding notes? Check out my{' '}
                <ExternalLink href="https://github.com/bronsonavila/" text="GitHub" />.
              </p>
            </PosedDivChild>
          </PosedDiv>
        </div>
      </div>
    </>
  );
};
