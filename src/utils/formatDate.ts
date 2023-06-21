/**
 * Formats a `Date` object as `YYYY-MM-DD`.
 *
 * See: https://stackoverflow.com/a/23593099
 */
const formatDate = (date: Date): string => {
  const normalizedDate = new Date(date)

  const month = normalizedDate.getMonth() + 1
  const day = normalizedDate.getDate()
  const year = normalizedDate.getFullYear()

  const paddedMonth = month < 10 ? `0${month}` : month
  const paddedDay = day < 10 ? `0${day}` : day

  return `${year}-${paddedMonth}-${paddedDay}`
}

export default formatDate
