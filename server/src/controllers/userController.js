const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const deleteImage = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientURL } = require("../secret");
const { emailWithNodeMailer } = require("../helper/email");
const fs = require("fs").promises;

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const searchRegEx = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegEx } },
        { email: { $regex: searchRegEx } },
        { phone: { $regex: searchRegEx } },
      ],
    };
    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter, options).countDocuments();

    if (!users) throw createError(404, "user not found.");

    return successResponse(res, {
      statusCode: 200,
      message: "users return success",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User return success",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    const userImage = user.image;
    deleteImage(userImage);
    await User.findByIdAndDelete({ _id: id, isAdmin: false });
    return successResponse(res, {
      statusCode: 200,
      message: "User delete success",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(409, "email already exists. please login");
    }

    // call jwt token
    const token = createJSONWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    // prepare email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
        <h2> Hello ${name} ! </h2>
        <p> Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">active your account</a> </p>
      `,
    };

    // send email with nodeMailer
    try {
      await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verification email"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please check your ${email}  and verify your account`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, deleteUserById, processRegister };
