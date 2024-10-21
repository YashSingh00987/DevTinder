const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateUpdateProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateUpdateProfileData(req)) {
      throw new Error("Invalid Update Request!!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile have been updated`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const enteredPassword = req.body.password;
    const changedPassword = req.body.newPassword;
    console.log(loggedInUser.password, enteredPassword, changedPassword);
    const isPasswordvalid = await loggedInUser.validatePassword(
      enteredPassword
    );
    console.log(isPasswordvalid);
    if (!isPasswordvalid) {
      throw new Error(
        "Incorrect Password Entered!!, Unable to change Password"
      );
    }

    const isStrongPassword = validator.isStrongPassword(changedPassword);
    if (!isStrongPassword) {
      throw new Error("Please provide a Stong Password");
    } else {
      const passwordHash = await bcrypt.hash(changedPassword, 10);
      loggedInUser.password = passwordHash;
    }

    loggedInUser.save();
    res.send("Password Changed Successfully!!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = profileRouter;
