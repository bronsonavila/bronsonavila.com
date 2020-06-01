import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import posed from 'react-pose';

import ExternalLink from '../components/ExternalLink';
import Metadata from '../components/Metadata';

const duration = 350;

const PosedDiv = posed.div({
  visible: { staggerChildren: duration / 2 },
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
              text="LinkedIn"
              url="https://www.linkedin.com/in/bronsonavila/"
            />{' '}
            profile. You can also find some of my pet projects and coding notes on{' '}
            <ExternalLink text="GitHub" url="https://github.com/bronsonavila/" />. If
            you'd like a little more than just the brass tacks, then please read on.
          </p>
          <PosedDiv pose={isLoaded ? 'visible' : 'hidden'}>
            <PosedDivChild>
              <h3 className="text-center mb-12 mt-16">Software Developer</h3>
              <p>
                I've been developing websites and applications as a hobbyist since 2017
                and professionally since 2018. I started off self-teaching via online
                resources simply out of curiosity and having a desire to learn something
                new. After falling down the rabbit hole, I quit my job as an attorney and
                joined a coding bootcamp to shift careers.
              </p>
              <p>
                Why make the change? Software development offers the potential for
                creative expression, open access to information, and general human
                empowerment. There is, sadly, little room for such ideals in a legal
                system designed to value precedent over innovation, secrecy over
                disclosure, and conformity over self-determination.
              </p>
              <p>
                My long-term goal is to use my knowledge of law and technology to improve
                access to legal information and increase the efficiency of the
                administration of justice. Meanwhile, I continue learning as much as I can
                while seeking to help good people do good work. If you're similarly naive
                and ambitious, I'm happy to make <Link to="/contact/">contact</Link>.
              </p>
            </PosedDivChild>
            <PosedDivChild>
              <h3 className="text-center mb-12 mt-16">Attorney</h3>
              <p>
                I previously worked as an attorney in criminal defense, plaintiff's civil
                rights litigation, and legislative research and analysis. I wouldn't
                discourage anyone from taking the same path, but any would-be lawyers
                should know what they're getting into.
              </p>
              <p>
                Litigation is not a truth-seeking process—it is a dispute resolution
                process. You may hope to only stand for a righteous cause, but sometimes
                you may have to fight for positions you do not agree with or might not
                even believe to be true. The court does not care. Resolve the dispute. If
                you can't, be prepared for trial.
              </p>
              <p>
                As a research attorney at my state legislature, I helped craft legislation
                throughout the law-making process. Heard the expression about "laws and
                sausages"? It's true.
              </p>
              <p>
                Notwithstanding the perils, working as an attorney was a worthwhile
                experience. The job is high-stakes, and it demands thoroughness,
                preparedness, and relentless attention to detail. These skills continue to
                serve me as a software developer.
              </p>
            </PosedDivChild>
          </PosedDiv>
        </div>
      </div>
    </>
  );
};
