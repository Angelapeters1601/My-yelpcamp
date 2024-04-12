const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema; //define schema

//   schema
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// midleware for deletion
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      }, //the doc has reviews and we are going to delete all reviews where their id field
      //is in our doc that was deleted in its reviews array
    });
  }
});

// exporting model
module.exports = mongoose.model("Campground", CampgroundSchema);
