import firebaseApp from './firebase'

const monzoClientId = process.env.MONZO_CLIENT_ID
const monzoClientSecret = process.env.MONZO_CLIENT_SECRET
const db = firebaseApp.database()

const configurator = uid => {
  const userRef = db.ref(`users/${uid}`)

  return new Promise((resolve, reject) => {
    userRef.once(
      'value',
      userSnapshot => {
        const user = userSnapshot.val()

        resolve({
          uid,
          monzo: {
            clientId: monzoClientId,
            clientSecret: monzoClientSecret,
            ...user.monzoData
          },
          exporter: { ...user.exporter }
        })
      },
      reject
    )
  })
}

export default configurator
