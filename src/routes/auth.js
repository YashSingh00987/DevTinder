const express = require('express');
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation")
const User = require("../models/user")
const validator = require("validator")
const bcrypt = require("bcrypt")



authRouter.post("/signup", async (req, res) => {
    try {
      validateSignUpData(req);
  
      const { firstName, lastName, email, password } = req.body;
  
      const passwordHash = await bcrypt.hash(password, 10);
  
      
      const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
      });
      await user.save();
      res.send("User added successfully");
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  });
  
  authRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!validator.isEmail(email)) {
        throw new Error("Invalid email Id:" + email);
      }
  
      const user = await User.findOne({ email: email });
  
      if (!user) {
        throw new Error("invalid Credentials");
      }
      const isPasswordValid = await user.validatePassword(password);
  
      if (!isPasswordValid) {
        throw new Error("Invalid Credentials");
      } else {
        const token = await user.getJWT();
  
        res.cookie("token", token,{expires  : new Date(Date.now() + 8*3600000)});
        res.send("Login Successfully!!");
      }
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });


  authRouter.post("/logout",async (req,res) => {
    res.cookie("token",null,{
      expires: new Date(Date.now())
    });
    res.send("logout successfully!!")
  })

module.exports = authRouter;