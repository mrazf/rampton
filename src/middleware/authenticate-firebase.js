import admin from 'firebase-admin'

export default token => {
  return new Promise((resolve, reject) => {
    admin.auth().verifyIdToken(token)
    .then(({ uid }) => resolve)
    .catch(reject)
  })
}
