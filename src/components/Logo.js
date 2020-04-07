import React from 'react';
import posed from 'react-pose';
import { Link } from 'gatsby';

const duration = 300;
const ease = 'easeOut';
const position = 17;
const staggerChildren = duration / 4;

/**
 * @param {Integer} [x=0] - The initial `translateX` position of the logo box.
 * @param {Integer} [y=0] - The initial `translateY` position of the logo box.
 * @return {Object} - The initial pose of the logo box.
 */
const setLogoBoxInitPose = ({ x = 0, y = 0 } = {}) => {
  return { x, y, transition: { duration, ease } };
};

/**
 * @param {Integer} [x=0] - The new `translateX` position of the logo box.
 * @param {Integer} [y=0] - The new `translateY` position of the logo box.
 * @return {Object} - The pose that the logo box will change to on hover.
 */
const setLogoBoxHoverPose = ({ x = 0, y = 0 } = {}) => {
  return {
    x,
    y,
    onValueChange: e => e.element.classList.add('bg-white'),
    transition: { duration, ease },
  };
};

const Container = posed.div({
  hoverable: true,
  hover: {
    staggerChildren,
  },
  hoverEnd: {
    onPoseComplete: e =>
      [...e.element.childNodes].forEach(child => child.classList.remove('bg-white')),
  },
});

const LetterB = posed.div({
  init: setLogoBoxInitPose(), // Top left.
  hover: setLogoBoxHoverPose({ x: position }), // Move right.
});

const Dot1 = posed.div({
  init: setLogoBoxInitPose({ x: position }), // Top right.
  hover: setLogoBoxHoverPose({ x: position, y: position }), // Move down.
});

const Dot2 = posed.div({
  init: setLogoBoxInitPose({ y: position }), // Bottom left.
  hover: setLogoBoxHoverPose(), // Move up.
});

const LetterA = posed.div({
  init: setLogoBoxInitPose({ x: position, y: position }), // Bottom right.
  hover: setLogoBoxHoverPose({ y: position }), // Move left.
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
