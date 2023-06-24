import { Link } from 'gatsby'
import posed from 'react-pose'
import React, { FC, useRef } from 'react'

type LogoBoxPose = {
  x?: number
  y?: number
}

// Constants

const DURATION = 300
const EASE = 'easeOut'
const POSITION = 17

// Functions

const setLogoBoxInitPose = ({ x = 0, y = 0 }: LogoBoxPose = {}) => ({
  transition: { duration: DURATION, ease: EASE },
  x,
  y
})

const setLogoBoxHoverPose = ({ x = 0, y = 0 }: LogoBoxPose = {}) => ({
  transition: { duration: DURATION, ease: EASE },
  x,
  y
})

// Components

const AnimatedContainer = posed.div({
  hover: { staggerChildren: DURATION / 4 },
  hoverable: true
})

// Start at top left; move to bottom right.
const LetterB = posed.div({
  init: setLogoBoxInitPose(),
  hover: setLogoBoxHoverPose({ x: POSITION })
})

// Start at top right; move to bottom right.
const Dot1 = posed.div({
  init: setLogoBoxInitPose({ x: POSITION }),
  hover: setLogoBoxHoverPose({ x: POSITION, y: POSITION })
})

// Start at bottom left; move to top left.
const Dot2 = posed.div({
  init: setLogoBoxInitPose({ y: POSITION }),
  hover: setLogoBoxHoverPose()
})

// Start at bottom right; move to bottom left.
const LetterA = posed.div({
  init: setLogoBoxInitPose({ x: POSITION, y: POSITION }),
  hover: setLogoBoxHoverPose({ y: POSITION })
})

const Logo: FC = () => {
  const logoRef = useRef<HTMLDivElement | null>(null)

  const handleMouseEnter = () => logoRef.current?.classList.add('is-hovered')

  const handleMouseLeave = () => logoRef.current?.classList.remove('is-hovered')

  return (
    <Link aria-label="Logo" className="inline-block no-underline" to="/">
      <AnimatedContainer
        className="logo__container relative"
        ref={logoRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <LetterB className="logo__box" />

        <Dot1 className="logo__box" />

        <Dot2 className="logo__box" />

        <LetterA className="logo__box" />
      </AnimatedContainer>
    </Link>
  )
}

export default Logo
