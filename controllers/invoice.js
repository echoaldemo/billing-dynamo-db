const OAuthClient = require('intuit-oauth')
module.exports = {
  list: (req, res) => {
    const oauthClient = req.app.get('oauth')
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
  view: (req, res) => {
    const oauthClient = req.app.get('oauth')
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
  post: (req, res) => {
    const oauthClient = req.app.get('oauth')
    const companyID = oauthClient.getToken().realmId

    const url =
      oauthClient.environment === 'sandbox'
        ? OAuthClient.environment.sandbox
        : OAuthClient.environment.production

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
      .catch(function(e) {
        console.error(e)
      })
  }
}
