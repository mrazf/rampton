import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import transactions from './transactions/transactions'
import sheets from './sheets/sheets'
import monzoTransactions from './monzo-transactions/monzo-transactions'
import webhooks from './monzo-webhooks/webhooks'

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use('/transactions', transactions)
app.use('/sheets', sheets)
app.use('/monzo-transactions', monzoTransactions)
app.use('/monzo-webhooks', webhooks)

app.get('/status', (req, res) => { res.send('Looks like we\'re OK') })

export default app
