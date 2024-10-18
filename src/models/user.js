const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Invalid Password " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid Gender " + value);
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL " + value);
        }
      },
    },
    about: {
      type: String,
      default: "Default Value",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, "secret@123", { expiresIn: "7d" });
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const isPasswordValid = await bcrypt.compare(passwordByUser, this.password);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
