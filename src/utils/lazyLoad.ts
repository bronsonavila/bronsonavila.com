/**
 * A utility for implementing lazy loading. All elements with `.observable` class will be
 * subject to the `observerCallback` when they enter the viewport (i.e., when the `isIntersecting`
 * property of an IntersectionObserverEntry becomes `true`).
 *
 * To apply a custom `rootMargin`, add the `data-observer-root-margin` attribute to an `.observable` element.
 */
const lazyLoad = (observerCallback: IntersectionObserverCallback): void => {
  const observableElements = Array.from(document.querySelectorAll('.observable'))

  observableElements.forEach(element => {
    const rootMargin = element.getAttribute('data-observer-root-margin') || '0px'
    const options: IntersectionObserverInit = { rootMargin }
    const observer = new IntersectionObserver(observerCallback, options)

    observer.observe(element)
  })
}

export default lazyLoad
