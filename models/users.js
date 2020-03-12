const { dynamoose } = require('../config')
const { v4: uuidv4 } = require('uuid')
const users = dynamoose.model('billing-user', {
  id: String,
  googleId: String,
  email: String,
  familyName: String,
  givenName: String,
  imageUrl: String,
  name: String,
  type: String,
  company: String,
  status: String
})

module.exports = {
  add: async (req, res) => {
    const add = new users({
      id: uuidv4(),
      ...req.body
    })
    add
      .save()
      .then(result => res.status(201).json(result))
      .catch(err => {
        res.status(500).json(err)
      })
  },
  list: (req, res) => {
    users.query
      .all()
      .then(result => res.status(200).json(result))
      .catch(err => {
        res.status(500).json(err)
      })
  }
}
