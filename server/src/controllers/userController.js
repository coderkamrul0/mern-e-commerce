const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const mongoose = require('mongoose');

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

const getUser = async (req, res, next) => {
  try {
    const options = { password: 0 };
    const id = req.params.id;
    const user = await User.findById(id, options);
    if (!user) {
      throw createError(404, "User not exist.");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "user return success",
      payload: { user },
    });
  } catch (error) {
    if(error instanceof mongoose.Error){
      next(createError(400, "Invalid user id"))
    }
    return
    next(error);
  }
};

module.exports = { getUsers, getUser };
