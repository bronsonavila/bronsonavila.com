/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

const toggleActiveFooterState = footerRef => {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
    if (footerRef && footerRef.current) {
      footerRef.current.classList.add('is-active');
    }
  }
};

const Layout = ({ children }) => {
  const [isTicking, setIsTicking] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => toggleActiveFooterState(footerRef), 800);

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
    <>
      <div className="container h-full mx-auto px-4 py-6">
        <main className="mb-16">{children}</main>
      </div>
      <div className="overflow-hidden">
        <footer ref={footerRef}>
          <div className="container h-12 mx-auto px-4 py-4">
            <span className="text-white">
              <Link to="/" className="text-white no-underline">
                © {new Date().getFullYear()} Bronson Avila
              </Link>
            </span>
          </div>
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
