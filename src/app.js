const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error in saving the user" + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  //console.log(userEmail);

  const user = await User.findOne({ email: userEmail });


  try {
    if (!user) {
      res.status(404).send("User not found");
    } else {
        res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed",async (req,res) => {
  try{
    const users = await User.find({});
    res.send(users)

  }
  catch(err) {
    res.status(400).send("Something went wrong!!!")
  }
})

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
