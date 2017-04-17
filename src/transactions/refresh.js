import request from 'request'

const fresh = ({ uid, monzo, dynamo }) => {
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

      resolve({ uid, dynamo, monzo: { ...monzo, token: parsed } })
    })
  })
}

const save = ({ uid, monzo, dynamo }) => {
  const params = {
    TableName: 'Pennies-MonzoApiToken',
    Item: {
      ...monzo.token,
      pennies_user_id: uid
    }
  }

  return new Promise((resolve, reject) => {
    dynamo.put(params, (err, data) => {
      if (err) return reject(err)

      resolve({ uid, monzo, dynamo })
    })
  })
}

module.exports = ({ uid, monzo, dynamo }) => {
  return new Promise((resolve, reject) => {
    fresh({ uid, monzo, dynamo })
      .then(save)
      .then(resolve)
      .catch(reject)
  })
}
