const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { USER_ROLE } = require("../const");


const userSchema = mongoose.Schema({
  full_name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true , enum: USER_ROLE  }

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("users", userSchema);
