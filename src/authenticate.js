import admin from 'firebase-admin'

export default (req, res, next) => {
  const token = req.headers.authorization.substring('Bearer: '.length)

  admin.auth().verifyIdToken(token)
    .then(({ uid }) => {
      req.params.uid = uid
      next()
    })
    .catch(err => res.send({ code: 401, err }))
}
