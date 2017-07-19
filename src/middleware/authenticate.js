import authenticateVia from './firebase'

const authPrefix = 'Bearer: '
const authPrefixLength = authPrefix.length

export default (req, res, next) => {
  let token = null
  try {
    token = req.headers.authorization.substring(authPrefixLength)
  } catch (err) {
    res.send(401, { code: 401, error: 'Invalid authorization header' })
  }

  authenticateVia(token)
    .then(uid => {
      req.params.uid = uid
      next()
    })
    .catch(err => res.send({ code: 401, err }))
}
