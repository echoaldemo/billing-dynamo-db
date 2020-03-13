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
  original_data: Boolean,
  createdAt: { type: Date, required: true, default: Date.now }
});

const scanValue = req => {
  const { company_uuid } = req.params;
  const { original_data, billing_type } = req.query;
  let scanValue = {};
  if (Object.keys(req.query).length > 0) {
    scanValue = {
      company_uuid,
      billing_type,
      original_data: JSON.parse(original_data)
    };
  } else {
    scanValue = { company_uuid };
  }

  return scanValue;
};

module.exports = {
  create: (req, res) => {
    const add = new billing_profile({
      profile_id: uuidv4(),
      ...req.body,
      createdAt: new Date()
    });
    add
      .save()
      .then(result => res.status(201).json(result))
      .catch(err => {
        res.status(500).json(err);
      });
  },

  list: (req, res) => {
    billing_profile
      .scan(scanValue(req))
      .exec()
      .then(result => {
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  },
  edit: (req, res) => {
    billing_profile
      .update(
        { profile_id: req.params.profile_id },
        {
          $PUT: {
            ...req.body
          }
        }
      )
      .then(result => {
        res.status(201).json(result);
      })
      .catch(err => res.status(500).json(err));
  }
};
