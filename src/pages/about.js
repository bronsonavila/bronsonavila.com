import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import posed from 'react-pose';

import ExternalLink from '../components/ExternalLink';
import Metadata from '../components/Metadata';

const duration = 350;

const PosedDiv = posed.div({
  visible: { staggerChildren: duration / 3 },
});

const PosedDivChild = posed.div({
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } },
  hidden: { y: 50, opacity: 0 },
});

export default () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), duration);
  }, []);

  return (
    <>
      <Metadata title="About" />
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
            <ExternalLink href="https://github.com/bronsonavila/" text="GitHub" />. If you
            would like a little more than just the brass tacks, then please read on.
          </p>
          <PosedDiv pose={isLoaded ? 'visible' : 'hidden'}>
            <PosedDivChild>
              <h3 className="text-center mb-12 mt-16">Software Development</h3>
              <p>
                I have been developing websites and applications as a hobbyist since 2017
                and professionally since 2018. I started off self-teaching via online
                resources simply out of curiosity and having a desire to learn something
                new. After falling down the rabbit hole, I quit my job as an attorney and
                joined a coding bootcamp to shift careers.
              </p>
              <p>Why make the change?</p>
              <p>
                To me, software development is one of the greatest tools for human
                empowerment, as it offers the potential for unfettered creative expression
                and open access to information. By contrast, American jurisprudence is
                designed to value precedent over innovation, and the administration of
                justice is often lacking in transparency. The environment can grow to be
                quite stifling for those seeking real change.
              </p>
              <p>
                My long-term goal is to use my knowledge of law and technology to improve
                access to legal information and increase the efficiency of judicial
                systems. Meanwhile, I continue learning as much as I can while seeking to
                help good people do good work.
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
              <p>
                My experiences in law have taught me lessons that I will carry for a
                lifetime. Between managing demanding clients, researching novel legal
                issues, crafting persuasive arguments, and wrestling with the elusive
                nature of the truth—I did it all. The job is high-stakes, and it demands
                empathy, preparedness, and a relentless attention to detail. These are
                skills that can benefit anyone across all walks of life.
              </p>
            </PosedDivChild>
            <PosedDivChild>
              <h3 className="text-center mb-12 mt-16">Open Invitation</h3>
              <p>
                Please feel free to <Link to="/contact/">contact</Link> me if you are
                interested in learning more about law or programming, or if you are
                considering a career change to software development. It's always nice to
                correspond with like-minded people who share my naive ambition.
              </p>
            </PosedDivChild>
          </PosedDiv>
        </div>
      </div>
    </>
  );
};
