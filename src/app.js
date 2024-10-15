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

app.get("/user", async (req, res, next) => {
  

  if(!req.body.email){
    next();
  }
  const userEmail = req.body.email;

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

app.get("/user", async (req, res) => {
  const id = req.body.userId;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!!!");
  }
});

app.delete("/user", async (req, res) => {
  const id = req.body.userId;

  try {   
    const user = await User.findByIdAndDelete(id);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong!!!");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const id = req.params?.userId;
  const updatedData = req.body;

  

  try{

    const ALLOWED_UPDATES = [
      'password', 
      'age', 
      'gender', 
      'photoUrl', 
      'about', 
      'skills'
    ];

    const isAllowedUpdate = Object.keys(updatedData).every(
      (update) => ALLOWED_UPDATES.includes(update)
    );


    if(!isAllowedUpdate){
      console.log("Update not allowed");
      throw new Error('Update not allowed');
    }

    if(updatedData?.skills.length > 10){
      throw new Error('Skills array cannot be more than 10');
    }

    const user = await User.findByIdAndUpdate(id, updatedData, {runValidators:true});
    if(!user){
      res.status(404).send("User not found");
    }
    else{
      res.send("User updated successfully");
    }
  }
  catch(err){
    res.status(400).json({ error: err.message });
  }
}
)


  
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
