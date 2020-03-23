const fetch = require('node-fetch')
module.exports = {
  refresh: (req, res) => {
    const test = `Basic ${Buffer.from(
      'aff59baf-e10f-4bae-87a4-721340953bc2:988a62decb4a9b309f9e5c396bdcafc8f61ce9b062817cedaf86cc633d910591'
    ).toString('base64')}`

    console.log(test)

    fetch('https://api.domo.com/oauth/token?grant_type=client_credentials', {
      method: 'get',
      headers: {
        Accept: 'application/json',
        Authorization: test
      }
    })
      .then(res => res.json())
      .then(json => res.status(200).json(json))
      .catch(err => {
        res.status(500).json(err)
      })
  }
}
