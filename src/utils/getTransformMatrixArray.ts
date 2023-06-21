/**
 * Extracts the `transform` matrix values from an HTMLElement as an array of strings. For instance:
 * 'matrix(1, 0, 0, 1, -770, 0)' becomes ['1', '0', '0', '1', '-770', '0']
 *
 * See: https://stackoverflow.com/a/14397066
 */
const getTransformMatrixArray = (element: HTMLElement): string[] | null => {
  const transformProperty = window.getComputedStyle(element).getPropertyValue('transform')

  return transformProperty.match(/(-?[0-9.]+)/g)
}

export default getTransformMatrixArray
