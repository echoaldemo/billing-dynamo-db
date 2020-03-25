const fetch = require('node-fetch')

const getToken = async () => {
  const auth = `Basic ${Buffer.from(
    'aff59baf-e10f-4bae-87a4-721340953bc2:988a62decb4a9b309f9e5c396bdcafc8f61ce9b062817cedaf86cc633d910591'
  ).toString('base64')}`

  const res = await fetch(
    'https://api.domo.com/oauth/token?grant_type=client_credentials',
    {
      method: 'get',
      headers: {
        Accept: 'application/json',
        Authorization: auth
      }
    }
  )

  return res.json()
}

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
  },
  billable: async (req, res) => {
    var token
    const data = {
      sql: `SELECT company, campaign, SUM(duration) FROM billable_hours WHERE (DATE(datetime_opened) >= '${req.body.start}') && (DATE(datetime_opened) <= '${req.body.end}') AND company = '${req.body.company}' GROUP BY company, campaign;`
    }
    try {
      token = await getToken()
    } catch (err) {
      res.status(500).json(err)
    }

    fetch(
      'https://api.domo.com/v1/datasets/query/execute/6f53064d-5da5-47a3-896f-b8c89140bc3e',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token.access_token}`
        },
        body: JSON.stringify(data)
      }
    )
      .then(res => res.json())
      .then(json => res.status(200).json(json))
      .catch(err => {
        res.status(500).json(err)
      })
  }
}
