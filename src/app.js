const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const app = express();
const cookieParser = require("cookie-parser");
const { validateSignUpData } = require("./utils/validation");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    console.log(passwordHash);

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

app.post("/login", async (req, res) => {
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
 
app.get("/profile", userAuth,async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }

});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`${user.firstName} has sent the connection request`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database Successfully Connected!!");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database connection error");
  });
