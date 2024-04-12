const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const axios = require("axios");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("ERROR OCCURRED!!!!");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// call unsplash and return small image
async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "FX_pa0zLU1008fgbGh2NtOfCW8oNlE9FsGJ0mWwr4qE",
        collections: 547022,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
}

const seedDB = async () => {
  await Campground.deleteMany({}); //deletes all old contents
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "66155b2e925dc88a344c8ee7",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: await seedImg(),
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias molestias iste, officia tempore consequuntur enim expedita cum nobis ab ex.",
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
}); //closing connection

// directory path
// ./ refers to the current directory.
// ../ refers to the parent directory, moves up one level
//../../ moves up two levels.
//../../../ moves up three levels.

// - project
//   - models
//     - campground.js
//   - routes
//     - index.js
// you're in index.js inside the routes directory, and you want to import campground.js from the models directory,
// you'd use require("../models/campground")
// to navigate from routes to models (../ to go up one level) and then access the campground.js file.
// To access files in project : ../../bla bla bla
