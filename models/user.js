const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// user schema defined:
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, //not a validation, just index.
  },
});
UserSchema.plugin(passportLocalMongoose);

// model n export:
module.exports = mongoose.model("User", UserSchema);
