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
    req.app.set('oauth', oauthClient)

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
  callback: (req, res) => {
    billing_settings
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
  token: (req, res) => {
    res.send(req.app.get('token'))
  },
  refresh: async (req, res) => {
    const result = await billing_settings
      .query('settings_id')
      .eq('quickbooks')
      .exec()
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
        console.log(
          'The Refresh Token is  ' + JSON.stringify(authResponse.getJson())
        )
        // req.app.set(
        //   'token',
        //   JSON.stringify(authResponse.getJson(), null, 2)
        // )
        res.send(JSON.stringify(authResponse.getJson(), null, 2))
      })
      .catch(function(e) {
        console.error(e)
      })
  },
  disconnect: async (req, res) => {
    const result = await billing_settings
      .query('settings_id')
      .eq('quickbooks')
      .exec()
    const oauthClient = new OAuthClient(result[0].settings.oauth)
    console.log('The disconnect called ')
    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
      state: 'intuit-test'
    })
    res.send(authUri)
  }
}
