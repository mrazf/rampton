import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import transactions from './transactions/transactions'
import monzoTransactions from './monzo-transactions/monzo-transactions'

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use('/transactions', transactions)
app.use('/monzo-transactions', monzoTransactions)

app.get('/status', (req, res) => { res.send('Looks like we\'re OK') })

export default app
