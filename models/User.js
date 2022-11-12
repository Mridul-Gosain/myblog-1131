const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  first_name: String,
  last_name: String,
  email: String,
  phone_number: String,
  company_name: String,
  street_address: String,
  street_address2: String,
  city: String,
  postcode: String,
  country: String,
  tax_id: String,
  username: String,
  password: String,
  role: String,
});

const User = model("User", userSchema);
module.exports = User;
