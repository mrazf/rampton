import * as R from 'ramda'
import moment from 'moment'
import request from 'request'
import transform from './monzo-to-pennies-transaction'

const transformMultiple = R.map(transform)

const getTransactions = (url, headers) => {
  return new Promise((resolve, reject) => {
    console.info(`GET ${url}`)
    request.get(url, { headers }, (err, res, body) => {
      if (err) {
        console.error(`GET ${url} errored with ${err} at ${err.stack}`)

        return reject(err)
      }

      const response = JSON.parse(body)
      if (response.error) {
        console.error(response)

        return reject(response.error)
      }

      const allTransactions = response.transactions || []
      const transactions = allTransactions.filter(t => t.include_in_spending)

      if (!transactions.length) {
        console.info('GET https://api.monzo.com/transactions got no transactions')
        return resolve({ transactions })
      }

      console.info(`GET https://api.monzo.com/transactions got ${transactions.length} transactions`)

      return resolve({ transactions: transformMultiple(transactions) })
    })
  })
}

module.exports = (monzo, from, to) => {
  const since = from || moment.utc().subtract(2, 'month').endOf('month').format()
  const before = to || moment.utc().endOf('month').format()
  const urls = monzo.accountIds.map(id => {
    return `https://api.monzo.com/transactions?account_id=${id}&expand[]=merchant&since=${since}&before=${before}`
  })
  const headers = { Authorization: `Bearer ${monzo.token.access_token}` }
  const requests = urls.map(url => getTransactions(url, headers))

  return Promise.all(requests)
    .then(responses => {
      return responses.reduce((acc, response) => {
        return { transactions: [ ...response.transactions, ...acc.transactions ] }
      }, { transactions: [] })
    })
}
