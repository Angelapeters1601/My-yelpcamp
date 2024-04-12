const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReviews = async (req, res) => {
  console.log(req.params);
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  //console.log(req.body.review);
  review.author = req.user._id; //adding author to reviews
  campground.reviews.push(review); //adding req.body.reviews to the "reviews" in "campground.js"
  await review.save();
  await campground.save();
  req.flash("success", "Created new review!"); //flash
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted a review!"); //flash
  res.redirect(`/campgrounds/${id}`);
};
