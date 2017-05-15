import request from 'request'
import { database } from '../firebase'

const fresh = ({ uid, monzo, user }) => {
  return new Promise((resolve, reject) => {
    const options = {
      url: 'https://api.monzo.com/oauth2/token',
      form: {
        grant_type: 'refresh_token',
        client_id: monzo.clientId,
        client_secret: monzo.clientSecret,
        refresh_token: monzo.token.refresh_token
      }
    }

    request.post(options, (err, resCode, body) => {
      if (err) return reject(err)

      const parsed = JSON.parse(body)

      if (parsed.error) return reject(parsed.message)

      resolve({ uid, user, monzo: { ...monzo, token: parsed } })
    })
  })
}

const save = ({ uid, monzo, user }) => {
  const userRef = database.ref(`users/${uid}/monzoData/token`)

  return new Promise((resolve, reject) => {
    userRef.set({ ...monzo.token }, error => {
      if (error) reject(error)

      resolve({ uid, monzo, user })
    })
  })
}

module.exports = ({ uid, monzo, user }) => {
  return new Promise((resolve, reject) => {
    fresh({ uid, monzo, user })
      .then(save)
      .then(resolve)
      .catch(reject)
  })
}
