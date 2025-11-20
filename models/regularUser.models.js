const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    },
    place:{
        type:String,
    },
    numberOfVisitors:{
        type:Number,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
},{
    timestamps:true
});

regularUserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

regularUserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

regularUserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            ruid: this.ruid,
            userType: 'regular'
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const regularUserModel = mongoose.model("Regular_User", regularUserSchema);

module.exports.regularUserModel= regularUserModel