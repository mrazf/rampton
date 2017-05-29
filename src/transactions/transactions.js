import express from 'express'
import request from 'request'
import authenticate from '../middleware/authenticate'
import configurator from '../configurator'
import get from './get'
import refresh from './refresh'
import transform from './transform'

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
      const transactions = transform(result.transactions)

      res.send({ transactions })
    })
    .catch(err => {
      res.send({ code: 503, err })
    })
})

const updateTransaction = (config, transactionId, category) => {
  const { monzo } = config

  const url = `https://api.monzo.com/transactions/${transactionId}`
  const headers = { Authorization: `Bearer ${monzo.token.access_token}` }
  const form = { metadata: { category } }

  return new Promise((resolve, reject) => {
    console.info(`PATCH ${url}`)
    request.patch(url, { headers, form }, (err, res, body) => {
      if (err) {
        console.error(`PATCH ${url} errored with ${err} at ${err.stack}`)

        return reject(err)
      }

      const response = JSON.parse(body)
      if (response.error) {
        console.error(response)

        return reject(response)
      }

      resolve(response)
    })
  })
}

router.post('/transactions/:id', authenticate, (req, res) => {
  configurator(req.params.uid)
    .then(config => updateTransaction(config, req.params.id, req.body.categoryId))
    .then(transaction => {
      res.send({ transaction })
    })
    .catch(err => {
      res.send({ code: 503, err })
    })
})

export default router
