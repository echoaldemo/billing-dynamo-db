const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./models/users");
const logs = require("./models/logs");
const billing_profile = require("./models/billing_profile");

const app = express();
app.use(bodyParser.json({ strict: false }));

app.post("/api/users/create", users.add);
app.get("/api/users/list", users.list);
app.get("/api/users/:id", users.getById);
app.delete("/api/users/delete/:id", users.delete);
app.patch("/api/users/edit/:id", users.edit);

app.post("/api/logs/create", logs.add);
app.get("/api/logs/list", logs.list);

app.get("/", (req, res) => {
  res.json("Welcome to SLS");
});

app.get("/api/rate/:company_uuid", billing_profile.list);
app.post("/api/rate", billing_profile.create);
app.patch("/api/rate/:profile_id", billing_profile.edit);

module.exports.handler = serverless(app);
