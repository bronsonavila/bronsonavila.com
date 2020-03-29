import posed from 'react-pose';

const duration = 350;

const Transition = posed.div({
  enter: {
    delay: duration / 2,
    filter: 'blur(0px)',
    opacity: 1,
    y: 0,
    transition: { duration },
  },
  exit: {
    delay: duration / 2,
    filter: 'blur(10px)',
    opacity: 0,
    y: 50,
    transition: { duration: duration / 2 },
  },
});

export default Transition;
