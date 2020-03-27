const OAuthClient = require('intuit-oauth')
const { billing_settings } = require('../models')

module.exports = {
  authUri: (req, res) => {
    oauthClient = new OAuthClient({
      clientId: req.body.data.json.clientId,
      clientSecret: req.body.data.json.clientSecret,
      environment: req.body.data.json.environment,
      redirectUri: req.body.data.json.redirectUri
    })

    const add = new billing_settings({
      settings_id: 'quickbooks',
      settings: {
        oauth: oauthClient
      }
    })
    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
      state: 'intuit-test'
    })
    add
      .save()
      .then(() => res.send(authUri))
      .catch(err => res.status(500).json(err))
  },
  callback: async (req, res) => {
    await billing_settings
      .query('settings_id')
      .eq('quickbooks')
      .exec()
      .then(result => {
        const oauthClient = new OAuthClient(result[0].settings.oauth)
        oauthClient
          .createToken(req.url)
          .then(function(authResponse) {
            const add = new billing_settings({
              settings_id: 'quickbooks',
              settings: {
                oauth: oauthClient
              }
            })
            add.save()
            console.log(JSON.stringify(authResponse.getJson(), null, 2))
          })
          .catch(function(e) {
            console.error(e)
          })
      })
    res.send('')
  },
  refresh: async (req, res, next) => {
    const result = await billing_settings
      .query('settings_id')
      .eq('quickbooks')
      .exec()
    try {
      const oauthClient = new OAuthClient(result[0].settings.oauth)
      oauthClient
        .refresh()
        .then(function(authResponse) {
          const add = new billing_settings({
            settings_id: 'quickbooks',
            settings: {
              oauth: oauthClient
            }
          })
          add.save()
          next()
        })
        .catch(err => res.status(500).json(err))
    } catch (err) {
      res.status(500).json(err)
    }
  },
  disconnect: (req, res) => {
    billing_settings
      .delete('quickbooks')
      .then(cont => res.status(200).json(cont))
      .catch(err => res.status(500).json(err))
  },
  company: async (req, res) => {
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
        url: url + `/v3/company/${companyID}/companyinfo/${companyID}`
      })
      .then(function(authResponse) {
        res.send(JSON.parse(authResponse.text()))
      })
      .catch(function(e) {
        console.error(e)
      })
  }
}
