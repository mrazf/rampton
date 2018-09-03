import express from 'express'
import authenticate from '../middleware/authenticate'
import getHooks from '../monzo/get-hooks'
import postHook from '../monzo/post-hook'
import configurator from '../configurator'
import userFromAccountId from './user-from-account-id'
import transformAndWrite from './transform-and-write'

const router = express.Router()

router.get('/monzo-webhooks', authenticate, (req, res) => {
  configurator(req.params.uid)
    .then(getHooks)
    .then(result => res.send(result))
    .catch(err => {
      res.send({ code: 503, err })
    })
})

router.post('/monzo-webhooks', authenticate, (req, res) => {
  configurator(req.params.uid)
    .then(config => postHook(config))
    .then(result => res.send(200, result))
})

const seenTransactionIds = []

const processTransaction = (req, res, next) => {
  const {
    include_in_spending: includeInSpending,
    decline_reason: declineReason,
    id
  } = req.body.data

  if (seenTransactionIds.includes(id)) {
    return res.status(200).send({ meta: 'ignored' })
  } else {
    seenTransactionIds.push(id)
  }

  if (includeInSpending === false) {
    return res.status(200).send({ declineReason })
  }

  next()
}

router.post('/monzo-webhook', processTransaction, (req, res) => {
  userFromAccountId(req.body.data.account_id)
    .then(user => transformAndWrite(user, req.body.data))
    .then(() => {
      res.status(201).send(req.body)
    })
    .catch(err => {
      console.error(err)

      res.status(503).send({ code: 503, err })
    })
})

export default router
