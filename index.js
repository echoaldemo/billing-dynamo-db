const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require('body-parser')
const users = require('./models/users')
const app = express()
app.use(bodyParser.json({ strict: false }))

app.post('/api/users/create', users.add)
app.get('/api/users/list', users.list)

module.exports.handler = serverless(app)
