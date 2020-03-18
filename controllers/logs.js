const { logs } = require('../models')
const { v4: uuidv4 } = require('uuid')
const dateUtil = require('../utils/date')

module.exports = {
  add: async (req, res) => {
    const add = new logs({
      id: uuidv4(),
      date: dateUtil.getDate(),
      time: dateUtil.getTime(),
      edited: new Date().valueOf(),
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
    logs
      .scan()
      .all()
      .exec()
      .then(result => res.status(200).json(result.sort((a, b) => (a.edited < b.edited ? 1 : -1))))
      .catch(err => {
        res.status(500).json(err)
      })
  }
}
