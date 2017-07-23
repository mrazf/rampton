import database from './database'

const monzoClientId = process.env.MONZO_CLIENT_ID
const monzoClientSecret = process.env.MONZO_CLIENT_SECRET

const configurator = uid => {
  return new Promise((resolve, reject) => {
    database.get(`users/${uid}`)
      .then(user => {
        resolve({
          uid,
          monzo: {
            clientId: monzoClientId,
            clientSecret: monzoClientSecret,
            ...user.monzoData
          },
          exporter: { ...user.exporter },
          categories: { ...user.categories }
        })
      })
      .catch(reject)
  })
}

export default configurator
