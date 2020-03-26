const OAuthClient = require('intuit-oauth')
const { billing_settings } = require('../models')

module.exports = {
  list: async (req, res) => {
    const result = await billing_settings
      .query('settings_id')
      .eq('quickbooks')
      .exec()
    const oauthClient = new OAuthClient(result[0].settings.oauth)

    const companyID = oauthClient.getToken().realmId

    const url =
      oauthClient.environment === 'sandbox'
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production

    oauthClient
      .makeApiCall({
        url: url + `/v3/company/${companyID}/query?query=select * from Customer`
      })
      .then(function(authResponse) {
        res.send(JSON.parse(authResponse.text()))
      })
      .catch(function(e) {
        console.error(e)
      })
  },
  slug: async (req, res) => {
    const result = await billing_settings
      .query('settings_id')
      .eq('quickbooks')
      .exec()
    const oauthClient = new OAuthClient(result[0].settings.oauth)

    const companyID = oauthClient.getToken().realmId

    const url =
      oauthClient.environment === 'sandbox'
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production

    oauthClient
      .makeApiCall({
        url:
          url +
          `/v3/company/${companyID}/query?query=select * from Customer Where PrintOnCheckName='${req.params.slug}'`
      })
      .then(function(authResponse) {
        try {
          res.send(JSON.parse(authResponse.text()).QueryResponse.Customer[0])
        } catch (err) {
          res.status(404).json({ msg: 'customer not found' })
        }
      })
      .catch(function(e) {
        console.error(e)
      })
  },
  view: async (req, res) => {
    const result = await billing_settings
      .query('settings_id')
      .eq('quickbooks')
      .exec()
    const oauthClient = new OAuthClient(result[0].settings.oauth)

    const companyID = oauthClient.getToken().realmId

    const url =
      oauthClient.environment === 'sandbox'
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production

    oauthClient
      .makeApiCall({
        url: url + `/v3/company/${companyID}/customer/${req.params.id}`
      })
      .then(function(authResponse) {
        res.send(JSON.parse(authResponse.text()))
      })
      .catch(function(e) {
        console.error(e)
      })
  },
  create: async (req, res) => {
    const result = await billing_settings
      .query('settings_id')
      .eq('quickbooks')
      .exec()
    const oauthClient = new OAuthClient(result[0].settings.oauth)

    const companyID = oauthClient.getToken().realmId
    const url =
      oauthClient.environment === 'sandbox'
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production

    oauthClient
      .makeApiCall({
        url: url + `/v3/company/${companyID}/customer`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      })
      .then(function(authResponse) {
        res.send(JSON.parse(authResponse.text()))
      })
      .catch(function(e) {
        console.error(e)
      })
  }
}
