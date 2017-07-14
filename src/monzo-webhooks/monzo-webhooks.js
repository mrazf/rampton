import express from 'express'
import request from 'request'
import authenticate from '../middleware/authenticate'
import configurator from '../configurator'
import userFromAccountId from './user-from-account-id'
import transformAndWrite from './transform-and-write'

const router = express.Router()

const getHooks = ({ monzo }) => {
  const url = `https://api.monzo.com/webhooks?account_id=${monzo.accountId}`
  const headers = { Authorization: `Bearer ${monzo.token.access_token}` }

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

      return resolve(response)
    })
  })
}

router.get('/monzo-webhooks', authenticate, (req, res) => {
  configurator(req.params.uid)
    .then(getHooks)
    .then(result => res.send(result))
    .catch(err => {
      res.send({ code: 503, err })
    })
})

const newHook = ({ monzo }) => {
  const url = `https://api.monzo.com/webhooks`
  const headers = { Authorization: `Bearer ${monzo.token.access_token}` }
  const form = { account_id: monzo.accountId, url: 'https://rampton.herokuapp.com/monzo-webhook' }

  return new Promise((resolve, reject) => {
    console.info(`POST ${url}`)

    request.post(url, { headers, form }, (err, res, body) => {
      if (err) {
        console.error(`POST ${url} errored with ${err} at ${err.stack}`)

        return reject(err)
      }

      const response = JSON.parse(body)
      if (response.error) {
        console.error(response)

        return reject(response.error)
      }

      return resolve(response)
    })
  })
}

router.post('/monzo-webhooks', authenticate, (req, res) => {
  configurator(req.params.uid)
    .then(config => newHook(config))
    .then(result => res.send(200, result))
})

router.post('/monzo-webhook', (req, res) => {
  userFromAccountId(req.body.data.account_id)
    .then(user => transformAndWrite(user, req.body.data))
    .then(() => {
      res.status(200).send(req.body)
    })
    .catch(err => {
      res.status(503).send({ code: 503, err })
    })
})

export default router
