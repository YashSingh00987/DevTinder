const mongoose = require('mongoose');

const connectDB = async () =>{
   await mongoose.connect("mongodb+srv://YashSingh006:Yash006@devtinder.csnkr.mongodb.net/devTinder");
}

module.exports = connectDB;