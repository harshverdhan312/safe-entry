const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

adminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            uid: this.uid
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const adminModel = mongoose.model("Admin", adminSchema);

module.exports.adminModel = adminModel;