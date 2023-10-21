require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL = process.env.MONGODB_URL;
const defaultUserImage =
  process.env.DEFAULT_USER_IMAGE || "public/images/users/default.png";

module.exports = { serverPort, mongodbURL,defaultUserImage };
