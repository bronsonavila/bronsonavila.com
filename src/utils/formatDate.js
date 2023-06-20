/**
 * Formats a `Date` object as `YYYY-MM-DD`.
 *
 * Source: https://stackoverflow.com/a/23593099
 *
 * @param {Date} date
 * @return {String}
 */
const formatDate = date => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export default formatDate
