const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regularUserSchema = new Schema({
    ruid:{
        type : Number,
        required: true,
        unique: true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    place:{
        type:String,
        required:true
    },
    numberOfVisitors:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

const regularUserModel = mongoose.model("Regular_User", regularUserSchema);

module.exports.regularUserModel= regularUserModel