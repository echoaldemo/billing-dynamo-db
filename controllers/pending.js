const { pending } = require('../models')
const { v4: uuidv4 } = require('uuid')

module.exports = {
  create: (req, res) => {
    const add = new pending({
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
  delete: (req, res) => {
    pending
      .delete(req.params.id)
      .then(cont => res.status(200).json(cont))
      .catch(err => res.status(500).json(err))
  },
  edit: (req, res) => {
    pending
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
  },
  view: (req, res) => {
    pending
      .queryOne('id')
      .eq(req.params.id)
      .exec()
      .then(cont => res.status(200).json(cont))
      .catch(err => res.status(500).json(err))
  },
  listDeleted: (req, res) => {
    pending
      .scan({ status: 3 })
      .exec()
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json(err))
  },
  list: (req, res) => {
    pending
      .scan()
      .exec()
      .then(result =>
        res.status(200).json(result.filter(resu => resu.status != 3))
      )
      .catch(err => res.status(500).json(err))
  }
}
