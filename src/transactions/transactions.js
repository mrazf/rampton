import express from 'express'
import authenticate from '../authenticate'
import configurator from '../configurator'
import get from './get'
import refresh from './refresh'

const getTransactions = ({ uid, monzo, dynamo }, from, to) => {
  return new Promise((resolve, reject) => {
    get(monzo, from, to)
      .then(resolve)
      .catch(err => {
        console.warn(`Get transactions failed with ${err}, refreshing and retrying`)

        refresh({ uid, monzo, dynamo })
          .then(({ monzo }) => get(monzo, from, to))
          .then(resolve)
          .catch(reject)
      })
  })
}

const router = express.Router()

router.get('/', authenticate, (req, res) => {
  configurator(req.params.uid)
    .then(config => getTransactions(config, req.query.from, req.query.to))
    .then(result => res.send(result))
    .catch(err => {
      res.send({ code: 503, err })
    })
})

export default router
