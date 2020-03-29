import posed from 'react-pose';

const delay = 350;

const Transition = posed.div({
  enter: {
    delay: delay / 2,
    opacity: 1,
    y: 0,
    transition: {
      ease: 'easeOut',
      duration: delay,
    },
  },
  exit: {
    delay: delay / 2,
    opacity: 0,
    y: 50,
    transition: {
      ease: 'easeIn',
      duration: delay / 2,
    },
  },
});

export default Transition;
