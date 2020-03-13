const { users } = require('../models')
const { v4: uuidv4 } = require('uuid')

module.exports = {
  add: (req, res) => {
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
    users
      .scan()
      .exec()
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json(err))
  },
  getById: (req, res) => {
    users
      .scan({ googleId: req.params.id })
      .exec()
      .then(result => res.status(200).json(result[0]))
      .catch(err => res.status(500).json(err))
  },
  delete: (req, res) => {
    users
      .delete(req.params.id)
      .then(cont => res.status(200).json(cont))
      .catch(err => res.status(500).json(err))
  },
  edit: (req, res) => {
    users
      .update(
        { id: req.params.id },
        {
          $PUT: {
            ...req.body
          }
        }
      )
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json(err))
  }
}
