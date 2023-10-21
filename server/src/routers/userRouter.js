const express = require('express');
const { getUsers } = require('../controllers/userController');
const userRouter = express.Router();

  
userRouter.get("/", getUsers);
userRouter.get("/profile", );
  

module.exports = userRouter;