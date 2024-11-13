const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "about",
      "skills",
    ]);

    const data = pendingRequest.map((row) => row.fromUserId);

    res.json({
      message: "data fetched successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const allConnections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "about",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "about",
        "skills",
      ]);

    const data = allConnections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "All Connections",
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const loggedInuser = req.user;
    const feed = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInuser._id }, { toUserId: loggedInuser._id }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName lastName")
    // .populate("toUserId", "firstName lastName");

    const hideUserFeed = new Set();
    feed.forEach((req) => {
      hideUserFeed.add(req.fromUserId.toString());
      hideUserFeed.add(req.toUserId.toString());
    });

    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFeed) } },
        { _id: { $ne: loggedInuser._id } },
      ],
    })
      .select("firstName lastName about gender skills age photoUrl")
      .skip(skip)
      .limit(limit);

    res.send(userFeed);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
