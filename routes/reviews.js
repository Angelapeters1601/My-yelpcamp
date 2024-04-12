const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
// importing dependencies
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");

// routes
// C creating reviews
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReviews));

// D deleting reviews
// router.delete(
//   "/:reviewId",
//   isLoggedIn,
//   isReviewAuthor,
//   catchAsync(reviews.deleteReview)
// );

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
