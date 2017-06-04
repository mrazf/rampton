import moment from 'moment'

const convert = monthIndex => {
  const month = moment().month(monthIndex)
  const from = month.utc().startOf('month').format()
  const to = month.utc().endOf('month').format()

  return { from, to }
}

export default convert
