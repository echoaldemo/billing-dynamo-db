<<<<<<< HEAD
const { dynamoose } = require('../config')
const { v4: uuidv4 } = require('uuid')
const users = dynamoose.model('billing-users', {
=======
const { dynamoose } = require("../config");
const { v4: uuidv4 } = require("uuid");
const users = dynamoose.model("billing-user", {
>>>>>>> 9c08711a688e329915e11d391dc2732effb33286
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
});

module.exports = {
  add: async (req, res) => {
    const add = new users({
      id: uuidv4(),
      ...req.body
    });
    add
      .save()
      .then(result => res.status(201).json(result))
      .catch(err => {
        res.status(500).json(err);
      });
  },
  list: (req, res) => {
    users
      .scan()
      .all()
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
};
