const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    require: true,
  },

  toUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    require:true
  },
  status:{
    type:String,
    required:true,
    enum:{
        values: ["interested","ignored","accepted","rejected"],
        message:`{VALUE} is incorrect status type`,
    }
  }
},{timestamps:true});

connectionRequestSchema.index({fromUserId: 1,toUserId:1})
connectionRequestSchema.pre("save",function(next) {
    const currentConnection = this;
    if(currentConnection.fromUserId.equals(currentConnection.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})



const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequestModel;
