const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  public_id: {
    type: String,
    default: "",
  },

},{timestamps:true});
module.exports = mongoose.model("user", UserSchema);



