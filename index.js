const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const users = require("./controllers/users");
const logs = require("./controllers/logs");
const pending = require("./controllers/pending");
const auth = require("./controllers/auth");
const invoice = require("./controllers/invoice");
const customer = require("./controllers/customer");
const item = require("./controllers/item");
const billing_profile = require("./controllers/billing_profile");
const zapier = require("./models/zapier");
const aws = require("./models/aws");

const app = express();
app.use(bodyParser.json({ strict: false }));
app.use(cors());
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set("oauth", null);
app.set("token", null);
app.post("/authUri", urlencodedParser, auth.authUri);
app.get("/callback", auth.callback);
app.get("/retrieveToken", auth.token);
app.get("/refreshAccessToken", auth.refresh);
app.get("/disconnect", auth.disconnect);

app.get("/api/invoice", invoice.list);
app.get("/api/invoice/:id", invoice.view);
app.post("/api/invoice", invoice.post);

app.get("/api/customer", customer.list);
app.get("/api/customer/:id", customer.list);

app.get("/api/item", item.list);

app.post("/api/users/create", users.add);
app.get("/api/users/list", users.list);
app.get("/api/users/:id", users.getById);
app.delete("/api/users/delete/:id", users.delete);
app.patch("/api/users/edit/:id", users.edit);

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
app.get("/api/rate/company/:company_uuid", billing_profile.getByCompany);

app.get("/test", (req, res) => {

  res.send("Working fine")
})

app.post("/api/zapier/gmail", zapier.gmail);
app.post("/api/zapier/trello", zapier.trello);
app.post("/api/aws/upload", aws.upload);


module.exports.handler = serverless(app, {
  binary: ["image/png", "image/gif"]
});
