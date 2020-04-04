import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'gatsby';

/**
 * Reveals the footer when the page is no longer scrollable. Add an `offset`
 * value to reveal the footer when the user is `n` pixels away from the bottom
 * of the screen. (NOTE: An `offset` value of at least `1` is required for
 * the footer to work correctly on Firefox on MacOS. The default value is set
 * to `2` for good measure.)
 *
 * @param {object} footerRef - The footer's `ref` object.
 * @param {int} offset - A number of pixels substracted from `scrollHeight`.
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
        <div className="container h-12 mx-auto px-4 py-4">
          <Link to="/" className="font-sans text-white no-underline">
            © {new Date().getFullYear()} Bronson Avila
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
