import React from 'react';
import posed from 'react-pose';
import { Link } from 'gatsby';

const duration = 150;
const ease = 'easeOut';
const position = 17;
const staggerChildren = duration / 4;

const Container = posed.div({
  hoverable: true,
  hover: { staggerChildren },
});

const LetterB = posed.div({
  init: { x: 0, y: 0, transition: { ease, duration } },
  // Move right:
  hover: { x: position, y: 0, transition: { ease, duration } },
});

const Dot1 = posed.div({
  init: { x: position, y: 0, transition: { ease, duration } },
  // Move down:
  hover: { x: position, y: position, transition: { ease, duration } },
});

const Dot2 = posed.div({
  init: { x: 0, y: position, transition: { ease, duration } },
  // Move up:
  hover: { x: 0, y: 0, transition: { ease, duration } },
});

const LetterA = posed.div({
  init: { x: position, y: position, transition: { ease, duration } },
  // Move left:
  hover: { x: 0, y: position, transition: { ease, duration } },
});

const Logo = ({ siteTitle }) => (
  <Link to="/" className="inline-block no-underline">
    <Container className="logo__container">
      <LetterB className="logo__box" />
      <Dot1 className="logo__box" />
      <Dot2 className="logo__box" />
      <LetterA className="logo__box" />
    </Container>
  </Link>
);

export default Logo;
