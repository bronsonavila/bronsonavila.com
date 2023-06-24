import { Link } from 'gatsby'
import React, { FC, RefObject, useEffect, useRef, useState } from 'react'

const FOOTER_REVEAL_DELAY_MS = 850

/**
 * Function to activate the footer when the user has scrolled to the bottom of the page.
 * An optional `offset` argument can be provided, which activates the footer when the user
 * is `offset` pixels away from the bottom of the page. By default, this offset is set to 2
 * to ensure proper functionality on Firefox on MacOS.
 */
const toggleActiveFooterState = (footerRef: RefObject<HTMLDivElement>, offset = 2) => {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - offset) {
    footerRef.current?.classList.add('is-active')
  }
}

const Footer: FC = () => {
  const [isTicking, setIsTicking] = useState<boolean>(false)
  const footerRef = useRef<HTMLDivElement>(null)

  // Handle scroll events to reveal the footer at the right time.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
  useEffect(() => {
    setTimeout(() => toggleActiveFooterState(footerRef), FOOTER_REVEAL_DELAY_MS)

    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          toggleActiveFooterState(footerRef)
          setIsTicking(false)
        })
        setIsTicking(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isTicking, footerRef])

  return (
    <div className="footer-container absolute bottom-0 w-full overflow-hidden">
      <footer className="border-t border-gray-400 mx-6 transition-all duration-300 ease-in-out" ref={footerRef}>
        <div className="container h-12 mx-auto px-4 pt-3 pb-5">
          <Link to="/" className="inline-block font-sans text-sm xs:text-base no-underline pt-px">
            <span className="text-red-700">©</span>{' '}
            <span className="text-gray-600 hover:text-gray-900">{new Date().getFullYear()} Bronson Avila</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Footer
