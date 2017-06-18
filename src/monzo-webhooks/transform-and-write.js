import moment from 'moment'
import transform from '../transactions/monzo-to-pennies-transaction'
import replace from '../sheets/replace'

export default (user, transaction) => {
  return new Promise((resolve, reject) => {
    const transformed = transform(transaction)

    const { ramptonTokens, spreadsheetId } = user.exporter
    const month = moment(transformed.dateTime).month()

    replace(ramptonTokens, spreadsheetId, [ transformed ], user.categories, month)
      .then(resolve)
      .catch(reject)
  })
}
