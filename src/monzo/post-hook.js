import request from 'request'

const postHook = ({ monzo }) => {
  const url = `https://api.monzo.com/webhooks`
  const headers = { Authorization: `Bearer ${monzo.token.access_token}` }
  const form = { account_id: monzo.accountId, url: 'https://rampton.herokuapp.com/monzo-webhook' }

  return new Promise((resolve, reject) => {
    console.info(`POST ${url}`)

    request.post(url, { headers, form }, (err, res, body) => {
      if (err) {
        console.error(`POST ${url} errored with ${err} at ${err.stack}`)

        return reject(err)
      }

      const response = JSON.parse(body)
      if (response.error) {
        console.error(response)

        return reject(response.error)
      }

      return resolve(response)
    })
  })
}

export default postHook
