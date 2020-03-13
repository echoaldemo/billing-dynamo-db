const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./controllers/users");
const logs = require("./controllers/logs");
const pending = require("./controllers/pending");
const billing_profile = require("./controllers/billing_profile");
const app = express();

app.use(bodyParser.json({ strict: false }));

app.post("/api/users/create", users.add);
app.get("/api/users/list", users.list);
app.get("/api/users/:id", users.getById);
app.delete("/api/users/delete/:id", users.delete);
app.patch("/api/users/edit/:id", users.edit);

app.get("/api/pending/list", pending.list);
app.post("/api/create_pending", pending.create);
app.delete("/api/pending/delete/:id", pending.delete);
app.patch("/api/pending/edit/:id", pending.edit);
app.get("/api/pending_view/:id", pending.view);
app.get("/api/pending/deleted/list", pending.listDeleted);

app.post("/api/logs/create", logs.add);
app.get("/api/logs/list", logs.list);

app.get("/api/rate/:company_uuid", billing_profile.list);
app.post("/api/rate", billing_profile.create);
app.patch("/api/rate/:profile_id", billing_profile.edit);

module.exports.handler = serverless(app);
