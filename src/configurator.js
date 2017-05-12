import firebaseApp from './firebase'
import { User } from './databases'

const monzoClientId = process.env.MONZO_CLIENT_ID
const monzoClientSecret = process.env.MONZO_CLIENT_SECRET
const db = firebaseApp.database()

const configurator = uid => {
  return new Promise((resolve, reject) => {
    User.findById(uid)
      .then(instance => {
        resolve({
          user: instance,
          uid,
          monzo: {
            clientId: monzoClientId,
            clientSecret: monzoClientSecret,
            accountId: instance.dataValues.account_id,
            token: { ...instance.dataValues.monzo_token }
          }
        })
      })
      .catch(reject)
  })
}

export default configurator

export const firebase = uid => {
  const userRef = db.ref(`users/${uid}`)

  return new Promise((resolve, reject) => {
    userRef.once(
      'value',
      userSnapshot => resolve(userSnapshot.val()),
      reject
    )
  })
}
