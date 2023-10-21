const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDatabase = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    console.log("Successfully connect mongoDB");

    mongoose.connection.on("error", (error) => {
      console.error("mongoDB connection error:", error);
    });
  } catch (error) {
    console.error("Could not connect to db:", error.toString());
  }
};

module.exports = connectDatabase;

