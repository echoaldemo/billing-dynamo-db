const { dynamoose } = require("../config");
const { v4: uuidv4 } = require("uuid");
const dateUtil = require("../utils/date");
const logs = dynamoose.model("billing-logs", {
  id: String,
  date: String,
  time: String,
  type: String,
  description: String,
  invoiceId: String
});

module.exports = {
  add: async (req, res) => {
    const add = new logs({
      id: uuidv4(),
      date: dateUtil.getDate(),
      time: dateUtil.getTime(),
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
    logs
      .scan()
      .all()
      .exec()
      .then(result => res.status(200).json(result))
      .catch(err => {
        res.status(500).json(err);
      });
  }
};
