const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email " + value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Invalid Password " + value)
            }
        }
        
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("Invalid Gender " + value)
            }
        }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL " + value)
            }
        }
    },
    about:{
        type:String,
        default:"Default Value"
    },
    skills:{
        type:[String]
    },
    
},{
    timestamps:true
})

module.exports = mongoose.model('User',userSchema);