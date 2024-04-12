const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// reviews schema
const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// model
module.exports = mongoose.model("Review", reviewSchema);
