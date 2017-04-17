import {} from 'dotenv/config'
import admin from 'firebase-admin'
import app from './app'

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }),
  databaseURL: 'https://pennies-9cba3.firebaseio.com/'
})

app.set('port', (process.env.PORT || 9001))
app.listen(app.get('port'), () => console.log('Pennies Transactions is running on port', app.get('port')))

export default app
