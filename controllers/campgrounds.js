const Campground = require("../models/campground");

// routes -MVC
// index
module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// C - get
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

// C - post
module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground); //new model or campground
  campground.author = req.user._id; //remember req.user shows who's online ie logged in
  await campground.save();
  req.flash("success", "Successfully made a new campground!"); //flash
  res.redirect(`/campgrounds/${campground._id}`);
};

// R - Show
module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      }
    })
    .populate("author");
  // console.log(req.body);
  // console.log(campground);
  if (!campground) {
    req.flash("error", "Oops! Cannot find the campground 😟😞");
    return res.redirect("/campgrounds");
  } //for flash
  // As a general rule, you should use return in the `if` block if you want to completely ensure that nothing below it gets when the `if` block gets triggered and executed. Therefore, I'd do that either way!
  res.render("campgrounds/show", { campground });
};

// U - get
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Oops! Cannot find the campground 😟😞");
    return res.redirect("/campgrounds");
  } //for flash
  res.render("campgrounds/edit", { campground });
};

// U - post
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    {
      ...req.body.campground,
    },
    { new: true }
  ); //copies the content of the body ie title n location
  req.flash("success", "Successfully updated a campground!"); //flash
  res.redirect(`/campgrounds/${campground._id}`);
};

// D - delete
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!"); //flash
  res.redirect("/campgrounds");
};
