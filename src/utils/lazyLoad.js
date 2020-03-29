/**
 * Utility for performing lazy loading. All `.observable` elements will be
 * modified by the `observerCallback` when the element comes into view (i.e.,
 * when the element's `isIntersecting` property returns `true`).
 *
 * @param {Function} observerCallback - Called when element is visible.
 */
export const lazyLoad = (observerCallback) => {
  const elements = [...document.querySelectorAll('.observable')];

  elements.forEach(element => {
    const offset = element.getAttribute('data-observable-offset') || '0px';
    const options = {
      rootMargin: offset,
    };
    const observer = new IntersectionObserver(observerCallback, options);
    observer.observe(element);
  });
};
