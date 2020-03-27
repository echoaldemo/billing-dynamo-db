require('dotenv').config()
const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const users = require('./controllers/users')
const logs = require('./controllers/logs')
const pending = require('./controllers/pending')
const qb_auth = require('./controllers/auth')
const invoice = require('./controllers/invoice')
const customer = require('./controllers/customer')
const item = require('./controllers/item')
const billing_profile = require('./controllers/billing_profile')
const zapier = require('./models/zapier')
const aws = require('./models/aws')
const domo = require('./controllers/domo')

const jwt = require('jsonwebtoken')
const secret = require('./secret')

const app = express()
app.use(bodyParser.json({ strict: false }))
app.use(cors())
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end()
  }
  try {
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, secret)
    next()
  } catch (err) {
    console.error(err)
    res.status(401).end()
  }
}

app.post('/authUri', urlencodedParser, auth, qb_auth.authUri)
app.get('/callback', qb_auth.callback)
app.get('/refreshAccessToken', auth, qb_auth.refresh)
app.get('/api/qb/disconnect', auth, qb_auth.disconnect)
app.get('/api/qb/company', auth, qb_auth.refresh, qb_auth.company)

app.get('/api/invoice', auth, qb_auth.refresh, invoice.list)
app.get('/api/invoice/:id', auth, qb_auth.refresh, invoice.view)
app.post('/api/invoice', auth, qb_auth.refresh, invoice.post)

app.get('/api/customer/list', auth, qb_auth.refresh, customer.list)
app.get('/api/customer/:id', auth, qb_auth.refresh, customer.view)
app.post('/api/customer/create', auth, qb_auth.refresh, customer.create)
app.get('/api/customer/view/:slug', auth, qb_auth.refresh, customer.slug)

app.get('/api/item', auth, qb_auth.refresh, item.list)

app.post('/api/users/create', users.add)
app.get('/api/users/list', auth, users.list)
app.get('/api/users/:id', users.getById)
app.delete('/api/users/delete/:id', auth, users.delete)
app.patch('/api/users/edit/:id', auth, users.edit)

app.get('/api/pending/list', auth, pending.list)
app.post('/api/create_pending', auth, pending.create)
app.delete('/api/pending/delete/:id', auth, pending.delete)
app.patch('/api/pending/edit/:id', auth, pending.edit)
app.get('/api/pending_view/:id', auth, pending.view)
app.get('/api/pending/deleted/list', auth, pending.listDeleted)

app.post('/api/logs/create', auth, logs.add)
app.get('/api/logs/list', auth, logs.list)

app.get('/api/rate/:company_uuid', auth, billing_profile.list)
app.post('/api/rate', auth, billing_profile.create)
app.patch('/api/rate/:profile_id', auth, billing_profile.edit)
app.get('/api/rate/company/:company_uuid', auth, billing_profile.getByCompany)

app.post('/api/zapier/gmail', auth, zapier.gmail)
app.post('/api/zapier/trello', auth, zapier.trello)
app.post('/api/aws/upload', auth, aws.upload)

app.post('/api/domo/billable', auth, domo.billable)

module.exports.handler = serverless(app, {
  binary: ['image/png', 'image/gif']
})
