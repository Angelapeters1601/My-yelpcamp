const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

//requiring routes
const userRoutes = require("./routes/user");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("ERROR OCCURRED!!!!");
    console.log(err);
  });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Database connected");
// });

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(bodyParser.urlencoded({ extended: true })); //for passing urlencoded in req.body
app.use(bodyParser.json()); // for parsing application/json in req.body
app.use(express.static(path.join(__dirname, "public"))); //for css
app.use(methodOverride("_method"));

// session
const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    HttpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //to expire in a week
    maxAge: 1000 * 60 * 60 * 24 * 7, //a week
  },
};
app.use(session(sessionConfig));
app.use(flash()); //flash configuration

// passport configuration - must come after session
app.use(passport.initialize()); //initializes passport
app.use(passport.session()); //manages session
passport.use(new localStrategy(User.authenticate())); //verifies

//passport config ... from our plugin (passportLocalMongoose):
passport.serializeUser(User.serializeUser()); //how we store user in d session
passport.deserializeUser(User.deserializeUser()); //how to get user out of the session.

// middleware for flash
app.use((req, res, next) => {
  res.locals.currentUser = req.user; //checks who's online
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.use for express router
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

// ************** Error handling middleware
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!!!";
  res.status(statusCode).render("error", { err });
});

// server
app.listen(3000, () => {
  console.log("Serving on port 3000!!!!");
});

/**************************************************************************/
// restful routing:
/**************************************************************************/
// GET /Campground is typically used to list all Campground.

// - GET /Campground/new displays a form for creating a new Campground.

// - POST /Campground is used to create a new Campground.

// - GET /Campground/:id shows a specific Campground.

// - GET /Campground/:id/edit displays a form to edit a Campground.

// - PUT/PATCH /Campground/:id updates a specific Campground.

// - DELETE /Campground/:id deletes a specific Campground.
