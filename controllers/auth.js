const OAuthClient = require('intuit-oauth')

module.exports = {
  authUri: (req, res) => {
    oauthClient = new OAuthClient({
      clientId: req.body.data.json.clientId,
      clientSecret: req.body.data.json.clientSecret,
      environment: req.body.data.json.environment,
      redirectUri: req.body.data.json.redirectUri
    })
    req.app.set('oauth', oauthClient)

    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
      state: 'intuit-test'
    })
    res.send(authUri)
  },
  callback: (req, res) => {
    const oauthClient = req.app.get('oauth')
    oauthClient
      .createToken(req.url)
      .then(function(authResponse) {
        req.app.set('token', JSON.stringify(authResponse.getJson(), null, 2))
      })
      .catch(function(e) {
        console.error(e)
      })
    res.send('')
  },
  token: (req, res) => {
    res.send(req.app.get('token'))
  },
  refresh: (req, res) => {
    const oauthClient = req.app.get('oauth')
    oauthClient
      .refresh()
      .then(function(authResponse) {
        console.log(
          'The Refresh Token is  ' + JSON.stringify(authResponse.getJson())
        )
        req.app.set('token', JSON.stringify(authResponse.getJson(), null, 2))
        res.send(JSON.stringify(authResponse.getJson(), null, 2))
      })
      .catch(function(e) {
        console.error(e)
      })
  },
  disconnect: (req, res) => {
    console.log('The disconnect called ')
    const oauthClient = req.app.get('oauth')
    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
      state: 'intuit-test'
    })
    res.send(authUri)
  }
}
