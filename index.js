const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./models/users");
const billing_profile = require("./models/billing_profile");
const app = express();
app.use(bodyParser.json({ strict: false }));

app.post("/api/users/create", users.add);
app.get("/api/users/list", users.list);

app.get("/", (req, res) => {
  res.json("Welcome to SLS");
});

app.get("/api/rate/:company_uuid", billing_profile.list);
app.post("/api/rate", billing_profile.create);
module.exports.handler = serverless(app);
