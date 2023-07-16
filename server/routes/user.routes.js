const express = require("express");
const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const blacklist = require("../blacklist");
require("dotenv").config();
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { pass, username } = req.body;
  const user = await UserModel.findOne({ username });

  try {
    if (user) {
      return res.status(200).json({ Message: "username is already tacken" });
    } else {
      bcrypt.hash(pass, 5, async (err, hash) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        } else {
          const user = await UserModel({ ...req.body, pass: hash });
          await user.save();
          return res
            .status(200)
            .json({ msg: "The new user has been registered", user });
        }
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { pass, username } = req.body;
  const user = await UserModel.findOne({ username });
  try {
    if (user) {
      bcrypt.compare(pass, user.pass, async (err, result) => {
        if (result) {
          const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.secrete,
            {
              expiresIn: 60 * 60 * 60,
            }
          );

          return res.status(200).json({ msg: "Login successful!", token });
        } else {
          return res.status(400).json({ msg: "Invalid Password" });
        }
      });
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.get("/logout", async (req, res) => {
  const token = req.headers.Authorization?.split(" ")[1];
  const blacklist = [];
  try {
    if (token) {
      blacklist.push(token);
      res.status(200).json({ msg: "User has been logged out" });
    } else {
      res.status(201).json({ msg: "Please Login" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = userRouter;
