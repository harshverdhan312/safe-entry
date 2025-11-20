const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema ({
    uid :{
        type : Number,
        required : true,
        unique : true
    },
    name:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    regularUserList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Regular_User"
    }],
    guardsList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Guards"
    }],
    qrScanList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"QR_Scan"
    }],
}, {
    timestamps : true
});

const adminModel = mongoose.model("Admin", adminSchema);

module.exports.adminModel = adminModel;