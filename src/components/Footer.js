import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'gatsby';

/**
 * Reveals the footer when the page is no longer scrollable.
 *
 * @param {object} footerRef - The footer's `ref` object.
 */
const toggleActiveFooterState = footerRef => {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
    if (footerRef && footerRef.current) {
      footerRef.current.classList.add('is-active');
    }
  }
};

const Footer = () => {
  const [isTicking, setIsTicking] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => toggleActiveFooterState(footerRef), 800);

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
    <div className="overflow-hidden">
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
