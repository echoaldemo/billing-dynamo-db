const jwt = require('jsonwebtoken')
const { users } = require('../models')
const { v4: uuidv4 } = require('uuid')
const secret = require('../secret')

module.exports = {
  add: (req, res) => {
    const add = new users({
      id: uuidv4(),
      edited: new Date().valueOf(),
      ...req.body
    })
    add
      .save()
      .then(result => {
        const token = jwt.sign({ googleId: req.params.id }, secret)
        res.status(201).json({ ...result, token })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
  list: (req, res) => {
    users
      .scan()
      .exec()
      .then(result =>
        res
          .status(200)
          .json(result.sort((a, b) => (a.edited < b.edited ? 1 : -1)))
      )
      .catch(err => res.status(500).json(err))
  },
  getById: (req, res) => {
    users
      .scan({ googleId: req.params.id })
      .exec()
      .then(result => {
        if (result[0]) {
          const token = jwt.sign({ googleId: req.params.id }, secret)
          res.status(200).json({ ...result[0], token })
        } else {
          res.status(404).json({ msg: 'no user' })
        }
      })
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
            ...req.body,
            edited: new Date().valueOf()
          }
        }
      )
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json(err))
  }
}
