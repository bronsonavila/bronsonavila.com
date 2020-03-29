import posed from 'react-pose';

const delay = 350;

const Transition = posed.div({
  enter: {
    delay: delay / 2,
    filter: 'blur(0px)',
    opacity: 1,
    y: 0,
    transition: { duration: delay },
  },
  exit: {
    delay: delay / 2,
    filter: 'blur(10px)',
    opacity: 0,
    y: 50,
    transition: { duration: delay / 2 },
  },
});

export default Transition;
