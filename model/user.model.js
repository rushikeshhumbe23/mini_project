const mongoose = require("mongoose");

const reqString = { type: String, required: true };
const reqNumber = { type: Number, required: true };
const reqArray = { type: Array, required: true };

const userSchema = mongoose.Schema(
  {
    name: reqString,
    username: reqString,
    pass: reqString,
    city: reqString,
    age: reqNumber,
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
