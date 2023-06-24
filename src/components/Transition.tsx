import posed from 'react-pose'

const DELAY = 350

const Transition = posed.div({
  enter: {
    delay: DELAY / 2,
    opacity: 1,
    transition: {
      ease: 'easeOut',
      duration: DELAY
    },
    y: 0
  },
  exit: {
    delay: DELAY / 2,
    opacity: 0,
    transition: {
      ease: 'easeIn',
      duration: DELAY / 2
    },
    y: 50
  }
})

export default Transition
