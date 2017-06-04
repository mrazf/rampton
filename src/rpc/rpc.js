import express from 'express'
import refreshMonth from '../sheets/refresh-month'
import authenticate from '../middleware/authenticate'

const router = express.Router()

router.post('/rpc', authenticate, (req, res) => {
  refreshMonth(req.params.uid, req.body.params)
    .then(result => res.send(result))
    .catch(err => {
      console.error(err)

      res.send(err)
    })
})

export default router
