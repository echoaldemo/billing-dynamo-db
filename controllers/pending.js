const { pending, billing_profile } = require('../models')
const { v4: uuidv4 } = require('uuid')

const modifyCampaigns = campaigns => {
  campaigns.forEach(element => {
    element.content = {
      bill_rate: parseFloat(element.content.bill_rate),
      performance_rate: parseFloat(element.content.performance_rate),
      did_rate: parseFloat(element.content.did_rate)
    }
  })

  return campaigns
}
module.exports = {
  create: (req, res) => {
    const add = new pending({
      id: uuidv4(),
      edited: new Date().valueOf(),
      ...req.body
    })
    add
      .save()
      .then(result => {
        const { campaigns, company } = result
        new billing_profile({
          profile_id: uuidv4(),
          company_uuid: company.uuid,
          company_slug: company.slug,
          company_name: company.name,
          rates: modifyCampaigns(campaigns),
          original_data: false,
          billing_type: req.body.billingType
        }).save()

        res.status(201).json(result)
      })
      .catch(err => res.status(500).json(err))
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
            ...req.body,
            edited: new Date().valueOf()
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
      .then(result =>
        res
          .status(200)
          .json(result.sort((a, b) => (a.edited < b.edited ? 1 : -1)))
      )
      .catch(err => res.status(500).json(err))
  },
  list: (req, res) => {
    pending
      .scan()
      .exec()
      .then(result =>
        res
          .status(200)
          .json(
            result
              .filter(resu => resu.status != 3)
              .sort((a, b) => (a.edited < b.edited ? 1 : -1))
          )
      )
      .catch(err => res.status(500).json(err))
  }
}
