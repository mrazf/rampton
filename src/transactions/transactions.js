import express from 'express'
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

router.get('/', authenticate, (req, res) => {
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

export default router
