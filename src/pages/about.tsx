import React, { useEffect, useState, FC } from 'react'
import { WindowLocation } from '@reach/router'
import ExternalLink from 'components/ExternalLink'
import Metadata from 'components/Metadata'
import posed from 'react-pose'

type Props = {
  location: WindowLocation
}

const DURATION = 350

const AnimatedContainer = posed.div({
  visible: { staggerChildren: DURATION / 3 } // Divide by number of children.
})

const AnimatedElement = posed.div({
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } },
  hidden: { y: 50, opacity: 0 }
})

const About: FC<Props> = ({ location }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timerId = setTimeout(() => setIsLoaded(true), DURATION)

    return () => clearTimeout(timerId)
  }, [])

  return (
    <>
      <Metadata description="About Bronson Avila" pathname={location.pathname} title="About" />

      <div className="container mx-auto px-4">
        <h1 className="text-center mb-16 pb-1 pt-8">About</h1>

        <div className="global-editor mb-8 pb-1">
          <AnimatedContainer pose={isLoaded ? 'visible' : 'hidden'}>
            <AnimatedElement>
              <p>
                I current work remotely as a front-end engineer at{' '}
                <ExternalLink href="https://www.tryklarity.com/" text="Klarity" />, which uses artificial intelligence
                to automate document workflows for finance and accounting teams.
              </p>
            </AnimatedElement>

            <AnimatedElement>
              <p>
                Previously employed as a software engineer at{' '}
                <ExternalLink href="https://www.meetbbot.com/" text="Bbot" /> prior to its acquisition by DoorDash, and
                also developed websites and web applications for clients of{' '}
                <ExternalLink href="https://www.longdash.co/" text="Long Dash" /> – including organizations such as the{' '}
                <ExternalLink href="https://canceratlas.cancer.org/" text="American Cancer Society" />, the{' '}
                <ExternalLink href="https://www.opengovpartnership.org/" text="Open Government Partnership" />, and the{' '}
                <ExternalLink href="https://www.splcenter.org/" text="Southern Poverty Law Center" />.
              </p>
            </AnimatedElement>

            <AnimatedElement>
              <p>
                Additional details about my professional experience and background can be found on{' '}
                <ExternalLink href="https://www.linkedin.com/in/bronsonavila/" text="LinkedIn" />. Old personal projects
                and coding notes can be found on <ExternalLink href="https://github.com/bronsonavila/" text="GitHub" />.
              </p>
            </AnimatedElement>
          </AnimatedContainer>
        </div>
      </div>
    </>
  )
}

export default About
