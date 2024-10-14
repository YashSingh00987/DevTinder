const mongoose = require('mongoose');

const connectDB = async () =>{
    mongoose.connect("mongodb+srv://YashSingh006:Yash006@devtinder.csnkr.mongodb.net/devTinder");
}

module.exports = connectDB;