import AWS from 'aws-sdk'

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
  logger: console
})

const monzoClientId = process.env.MONZO_CLIENT_ID
const monzoClientSecret = process.env.MONZO_CLIENT_SECRET

const monzoTokenPromise = (uid) => {
  const params = { TableName: 'Pennies-MonzoApiToken', Key: { 'pennies_user_id': uid } }

  return new Promise((resolve, reject) => {
    dynamo.get(params, (err, data) => {
      if (err) reject(err)

      resolve({ token: data['Item'] })
    })
  })
}

const monzoAccountPromise = (uid) => {
  const params = { TableName: 'Pennies-MonzoAccountId', Key: { 'pennies_user_id': uid } }

  return new Promise((resolve, reject) => {
    dynamo.get(params, (err, data) => {
      if (err) reject(err)

      resolve({ accountId: data['Item'].account_id })
    })
  })
}

export default (uid) => {
  return new Promise((resolve, reject) => {
    return Promise.all([ monzoTokenPromise(uid), monzoAccountPromise(uid) ])
      .then(values => {
        resolve({
          uid,
          dynamo,
          monzo: {
            clientId: monzoClientId,
            clientSecret: monzoClientSecret,
            ...values[0],
            ...values[1]
          }
        })
      })
      .catch(reject)
  })
}
