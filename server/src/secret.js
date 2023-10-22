require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL = process.env.MONGODB_URL;
const defaultUserImage =
  process.env.DEFAULT_USER_IMAGE || "public/images/users/default.png";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY;
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientURL = process.env.CLIENT_URL;
const uploadDir = process.env.UPLOAD_FILE || "public/images/users";

module.exports = {
  serverPort,
  mongodbURL,
  defaultUserImage,
  jwtActivationKey,
  smtpUsername,
  smtpPassword,
  clientURL,
  uploadDir,
};
