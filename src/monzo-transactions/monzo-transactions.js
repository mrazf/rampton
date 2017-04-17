import express from 'express'
const router = express.Router()

router.post('/', (req, res) => {
  res.json({ id: req.body.data.id })
})

export default router
