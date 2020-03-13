const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require('body-parser')
const users = require('./models/users')
const logs = require('./models/logs')
const app = express()
app.use(bodyParser.json({ strict: false }))

app.post('/api/users/create', users.add)
app.get('/api/users/list', users.list)
app.get('/api/users/:id', users.getById)
app.delete('/api/users/delete/:id', users.delete)
app.patch('/api/users/edit/:id', users.edit)

app.post('/api/logs/create', logs.add)
app.get('/api/logs/list', logs.list)

module.exports.handler = serverless(app)
