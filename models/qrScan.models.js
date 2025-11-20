const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const qrSchema = new Schema({
    qrId:{
        type:String,
        required:true,
        unique:true
    },
    qrCode:{
        type:String
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Regular_User"
    },
    scannedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Guard"
    },
    scannedAt:{
        type:Date,
        required:true
    }
},{
    timestamps:true
})

const qrCodeModel = mongoose.model("QR_Scan", qrSchema);
module.exports.qrCodeModel = qrCodeModel;