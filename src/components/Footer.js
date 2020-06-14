import { Link } from 'gatsby';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveals the footer when the page is no longer scrollable. Add an `offset`
 * value to reveal the footer when the user is `n` pixels away from the bottom
 * of the screen. (NOTE: An `offset` value of at least `1` is required for
 * the footer to work correctly on Firefox on MacOS. The default value is set
 * to `2` for good measure.)
 *
 * @param {Object} footerRef - The footer's `ref` object.
 * @param {Integer} [offset=2] - A number of pixels substracted from `scrollHeight`.
 */
const toggleActiveFooterState = (footerRef, offset = 2) => {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - offset) {
    if (footerRef && footerRef.current) {
      footerRef.current.classList.add('is-active');
    }
  }
};

const Footer = () => {
  const [isTicking, setIsTicking] = useState(false);
  const footerRef = useRef(null);
  const footerRevealDelay = 850;

  useEffect(() => {
    setTimeout(() => toggleActiveFooterState(footerRef), footerRevealDelay);

    // Throttle scroll event. See:
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          toggleActiveFooterState(footerRef);
          setIsTicking(false);
        });
        setIsTicking(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <div className="footer-container">
      <footer ref={footerRef}>
        <div className="container h-12 mx-auto px-4 pt-3 pb-5">
          <Link to="/" className="inline-block font-sans text-sm xs:text-base no-underline pt-px">
            <span className="text-red-700">©</span>{' '}
            <span className="text-gray-600 hover:text-gray-900">
              {new Date().getFullYear()} Bronson Avila
            </span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
