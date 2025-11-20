const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const guardSchema = new Schema({
    guid:{
        type : Number,
        required : true,
        unique : true
    },
    name:{
        type : String,
        required : true
    },
    contact_number:{
        type : Number,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    device:{
        type : String,
        required : true
    }
},{
    timestamps:true
});

const guardModel =  mongoose.model("Gaurds", guardSchema);

module.exports.guardModel = guardModel