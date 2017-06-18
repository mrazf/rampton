import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import transactions from './transactions/transactions'
import sheets from './sheets/sheets'
import monzoTransactions from './monzo-transactions/monzo-transactions'
import monzoWebhooks from './monzo-webhooks/monzo-webhooks'
import rpc from './rpc/rpc'

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use(transactions)
app.use('/sheets', sheets)

app.use('/monzo-transactions', monzoTransactions)
app.use(monzoWebhooks)

app.use(rpc)

app.get('/status', (req, res) => { res.send('Looks like we\'re OK') })

export default app
