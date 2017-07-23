import nock from 'nock'
import admin from 'firebase-admin'

nock.disableNetConnect()
nock.enableNetConnect('127.0.0.1')

process.env.FIREBASE_PROJECT_ID = 'pennies-9cba3'
process.env.FIREBASE_CLIENT_EMAIL = 'b'
process.env.FIREBASE_PRIVATE_KEY = 'c'

console.info = () => {}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }),
  databaseURL: 'https://rampton_project_id.firebaseio.com/'
})
