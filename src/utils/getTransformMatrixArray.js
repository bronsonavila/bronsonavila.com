/**
 * Returns an element's `transform` matrix string as an array, e.g.:
 * 'matrix(1, 0, 0, 1, -770, 0)' => ['1', '0', '0', '1', '-770', '0']
 *
 * See: https://stackoverflow.com/a/14397066
 *
 * @param {Node} element - An HTML element with a `transform` style applied.
 * @return {Array}
 */
const getTransformMatrixArray = element =>
  window
    .getComputedStyle(element)
    .getPropertyValue('transform')
    .match(/(-?[0-9.]+)/g);

export default getTransformMatrixArray;
