import express from 'express'
import moment from 'moment'
import authenticate from '../middleware/authenticate'
import { transactionsAndSpreadsheet, clearAndReplace } from '../sheets/refresh-month'
import configurator from '../configurator'
import get from './get'
import refresh from './refresh'
import updateTransaction from './update-transaction'

export const getTransactions = (config, from, to) => {
  const { uid, monzo, user } = config

  return new Promise((resolve, reject) => {
    get(monzo, from, to)
      .then(result => resolve({ ...result, config }))
      .catch(err => {
        console.warn(`Get transactions failed with ${err}, refreshing and retrying`)

        refresh({ uid, monzo, user })
          .then(({ monzo }) => get(monzo, from, to))
          .then(result => resolve({ ...result, config }))
          .catch(reject)
      })
  })
}

const router = express.Router()

router.get('/transactions', authenticate, (req, res) => {
  configurator(req.params.uid)
    .then(config => getTransactions(config, req.query.from, req.query.to))
    .then(result => {
      const transactions = result.transactions

      res.send({ transactions })
    })
    .catch(err => {
      console.error(err)

      res.send({ code: 503, err })
    })
})

router.post('/transactions/:id', authenticate, (req, res) => {
  const transaction = req.body.transaction
  const monthIndex = moment(transaction.dateTime).month()

  configurator(req.params.uid)
    .then(config => updateTransaction(config, req.params.id, req.body.transaction.categoryId))
    .then(({ config }) => transactionsAndSpreadsheet(config, monthIndex))
    .then(results => clearAndReplace(results, monthIndex))
    .then(() => res.send({ transaction }))
    .catch(err => {
      console.error(err)

      res.send({ code: 503, err })
    })
})

export default router
