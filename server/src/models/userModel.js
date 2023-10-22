const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultUserImage } = require("../secret");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minLength: [3, "User name min 3 characters"],
      maxLength: [30, "User name max 30 characters"],
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            v
          );
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: [6, "User password min 3 characters"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default: defaultUserImage,
    },
    address: {
      type: String,
      required: [true, "User address is required"],
    },
    phone: {
      type: String,
      required: [true, "User phone number is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("Users", userSchema);

module.exports = User;
