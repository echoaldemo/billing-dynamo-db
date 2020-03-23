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
        url: url + `/v3/company/${companyID}/query?query=select * from Invoice`
      })
      .then(function(authResponse) {
        res.send(JSON.parse(authResponse.text()))
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
        url: url + `/v3/company/${companyID}/invoice/${req.params.id}`
      })
      .then(function(authResponse) {
        res.send(JSON.parse(authResponse.text()))
      })
      .catch(function(e) {
        console.error(e)
      })
  },
  post: async (req, res) => {
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
    delete req.body.edited
    oauthClient
      .makeApiCall({
        url: url + `/v3/company/${companyID}/invoice`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(req.body)
      })
      .then(function(authResponse) {
        res.send(JSON.parse(authResponse.text()))
      })
      .catch(err => res.status(500).json(err))
  }
}
