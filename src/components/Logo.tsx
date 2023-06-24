import { Link } from 'gatsby'
import posed from 'react-pose'
import React, { FC } from 'react'

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
  onValueChange: (_: unknown, info: { element: EventTarget }) => {
    if (info.element instanceof Element) {
      info.element.classList.add('is-hovered')
    }
  },
  transition: { duration: DURATION, ease: EASE },
  x,
  y
})

// Components

const AnimatedContainer = posed.div({
  hoverable: true,
  hover: { staggerChildren: DURATION / 4 },
  hoverEnd: {
    onPoseComplete: (_: unknown, info: { element: Element }) => {
      info.element.childNodes.forEach((child: ChildNode) => {
        if (child instanceof Element) {
          child.classList.remove('is-hovered')
        }
      })
    }
  }
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

const Logo: FC = () => (
  <Link aria-label="Logo" className="inline-block no-underline" to="/">
    <AnimatedContainer className="logo__container relative">
      <LetterB className="logo__box" />

      <Dot1 className="logo__box" />

      <Dot2 className="logo__box" />

      <LetterA className="logo__box" />
    </AnimatedContainer>
  </Link>
)

export default Logo
