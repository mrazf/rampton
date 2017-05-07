import request from 'request'

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
  return new Promise((resolve, reject) => {
    user.update({ monzo_token: { ...monzo.token } })
      .then(() => resolve({ uid, monzo, user }))
      .catch(reject)
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
