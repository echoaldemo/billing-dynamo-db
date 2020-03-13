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
        url: url + `/v3/company/${companyID}/query?query=select * from Item`
      })
      .then(function(authResponse) {
        res.send(JSON.parse(authResponse.text()))
      })
      .catch(function(e) {
        console.error(e)
      })
  }
}
