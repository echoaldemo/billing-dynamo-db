const { dynamoose } = require("../config");
const { v4: uuidv4 } = require("uuid");
const billing_profile = dynamoose.model("billing-profile", {
  profile_id: String,
  company_uuid: String,
  campaign_uuid: String,
  billable_rate: Number,
  did_rate: Number,
  performance_rate: Number,
  billing_type: String,
  original_data: Boolean
});

const scanValue = req => {
  const { company_uuid } = req.params;
  const { original_data, billing_type } = req.query;
  let scanValue = {};
  if (Object.keys(req.query).length > 0) {
    scanValue = {
      company_uuid,
      billing_type,
      original_data: original_data === "true" ? true : false
    };
  } else {
    scanValue = { company_uuid };
  }

  return scanValue;
};

module.exports = {
  create: async (req, res) => {
    const add = new billing_profile({
      profile_id: uuidv4(),
      company_uuid: "test",
      campaign_uuid: "test",
      billable_rate: 32.3,
      did_rate: 323.3,
      performance_rate: 32.3,
      billing_type: "1",
      original_data: true
    });
    add
      .save()
      .then(result => res.status(201).json(result))
      .catch(err => {
        res.status(500).json(err);
      });
  },

  list: async (req, res) => {
    billing_profile
      .scan(scanValue(req))
      .exec()
      .then(result => res.status(200).json(result))
      .catch(err => {
        res.status(500).json(err);
      });
  }
};
