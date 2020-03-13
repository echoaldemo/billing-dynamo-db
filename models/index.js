const { dynamoose } = require("../config");

const users = dynamoose.model("billing-users", {
  id: String,
  googleId: String,
  email: String,
  familyName: String,
  givenName: String,
  imageUrl: String,
  name: String,
  type: String,
  company: String,
  status: String
});

const pending = dynamoose.model("billing-pending-invoice", {
  id: String,
  Line: Array,
  campaigns: Array,
  company: Object,
  docNumber: String,
  TxnTaxDetail: Object,
  dueDate: String,
  invoiceType: String,
  startDate: String,
  billingType: String,
  total: String,
  status: Number
});

const logs = dynamoose.model("billing-logs", {
  id: String,
  date: String,
  time: String,
  type: String,
  description: String,
  invoiceId: String
});

const billing_profile = dynamoose.model("billing-profile", {
  profile_id: String,
  company_uuid: String,
  campaign_uuid: String,
  billable_rate: Number,
  did_rate: Number,
  performance_rate: Number,
  billing_type: String,
  original_data: Boolean,
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = {
  users,
  pending,
  logs,
  billing_profile
};
