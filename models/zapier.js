const fetch = require("node-fetch");
module.exports = {
  gmail: (req, res) => {
    fetch("http://hooks.zapier.com/hooks/catch/2367706/omx1hm6/", {
      method: "post",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(json => res.status(201).json(json))
      .catch(err => {
        res.status(500).json(err);
      });
  },
  trello: (req, res) => {
    fetch("https://hooks.zapier.com/hooks/catch/2367706/o1rfjiv/", {
      method: "post",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(json => res.status(201).json(json))
      .catch(err => {
        res.status(500).json(err);
      });
  }
};
