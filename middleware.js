const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Campground = require("./models/campground");
const Review = require("./models/campground");

//middleware for isLoggedIn
module.exports.isLoggedIn = (req, res, next) => {
  //console.log("REQ.USER...", req.user); //checking online user
  //store the url they are requesting in session!
  if (!req.isAuthenticated()) {
    //console.log(req.path, req.originalUrl); //gives us url of the visited pages
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in to access this page!!!");
    return res.redirect("/login");
  }
  next();
};

//middleware for returnTo
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// ********defining schema for Joi (server side validation).....middleware:**********
// validation for campgrounds...
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// middleware for edit and delete protection by user that isn't the author on campground
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!!!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// middleware for  delete protection by user that isn't the author on reviews
//reviewId came from the delete route of review on review.js
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  console.log(id);
  console.log(req.params.reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!!!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// ********defining schema for Joi (server side validation).....middleware:**********
//validation for reviews....
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
