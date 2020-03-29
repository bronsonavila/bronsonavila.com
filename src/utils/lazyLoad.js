/**
 * Utility for performing lazy loading. All `.observable` elements will be
 * modified by the `observerCallback` when the element comes into view (i.e.,
 * when the element's `isIntersecting` property returns `true`).
 *
 * The `data-observer-root-margin` attribute can be added to an `.observable`
 * element to apply a custom `rootMargin`.
 *
 * @param {Function} observerCallback - Called when element is visible.
 */
export const lazyLoad = observerCallback => {
  const elements = [...document.querySelectorAll('.observable')];

  elements.forEach(element => {
    const rootMargin =
      element.getAttribute('data-observer-root-margin') || '0px';
    const options = { rootMargin };
    const observer = new IntersectionObserver(observerCallback, options);
    observer.observe(element);
  });
};
