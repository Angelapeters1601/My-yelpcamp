const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { storeReturnTo } = require("../middleware");

// routes
// register route:
router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      // res.send(req.body);
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);
      //automatic login
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp camp");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

// login routes:
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  //use storeReturnTo middleware to save the returnTo value from session to res.locals
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true, //flashes error message
    failureRedirect: "/login", //redirects
  }),
  (req, res) => {
    req.flash("success", "welcome back!!"); //flashes success message
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl); //redirects
  }
);

//logout routes:
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
