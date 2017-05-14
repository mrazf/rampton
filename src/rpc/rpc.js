import express from 'express'
import resetMonth from '../sheets/reset-month'
import authenticate from '../authenticate'

const router = express.Router()

router.get('/rpc', authenticate, (req, res) => {
  resetMonth(req.params.uid)
    .then(result => res.send(result))
    .catch(err => res.send(err))
})

export default router
