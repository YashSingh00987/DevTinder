const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`${user.firstName} has sent the connection request`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
