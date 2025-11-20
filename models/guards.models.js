const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    },
    password:{
        type : String,
        required : true
    },
    device:{
        type : String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
},{
    timestamps:true
});

guardSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

guardSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

guardSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            guid: this.guid,
            userType: 'guard'
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const guardModel =  mongoose.model("Gaurds", guardSchema);

module.exports.guardModel = guardModel