const fetch = require('node-fetch')

const getToken = async () => {
  const domo = `${process.env.DOMO_CLIENT_ID}:${process.env.DOMO_CLIENT_SECRET}`
  const auth = `Basic ${Buffer.from(domo).toString('base64')}`
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
      `https://api.domo.com/v1/datasets/query/execute/${process.env.DOMO_DATASETS}`,
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
