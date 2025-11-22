const { asyncHandler } = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { qrCodeModel } = require("../models/qrScan.models.js");
const { regularUserModel } = require("../models/regularUser.models.js");
const { generateCustomId } = require("../utils/idGenerator.js");
const QRCode = require('qrcode');


const createQr = asyncHandler(async (req, res) => {
    console.log(req.query.userId)
    const { userId } = req.query; 
    console.log(userId)
    if (!userId) {
        throw new ApiError(400, "User ID is required to create a QR code");
    }

    const user = await regularUserModel.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const qrId = generateCustomId('99', 100000, 999999);

    const qrDataURL = await QRCode.toDataURL(qrId);

    const qrData = {
        qrId: qrId,
        qrCode: qrDataURL, 
        createdBy: user._id,
    };

    const newQr = await qrCodeModel.create(qrData);

    return res.status(201).json(
        new ApiResponse(201, newQr, "QR Code created successfully")
    );
});

const viewMyVisitors = asyncHandler(async (req, res) => {
    const { userId } = req.params; 

    const scans = await qrCodeModel.find({ createdBy: userId })
        .populate("scannedBy", "name guid");

    return res.status(200).json(
        new ApiResponse(200, scans, "Visitor history fetched successfully")
    );
});

const downloadQr = asyncHandler(async (req, res) => {
    const { qrId } = req.params;
    const qrRecord = await qrCodeModel.findOne({ qrId });

    if (!qrRecord) {
        throw new ApiError(404, "QR Code not found");
    }

    const imgData = qrRecord.qrCode.replace(/^data:image\/png;base64,/, "");
    const imgBuffer = Buffer.from(imgData, 'base64');

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imgBuffer.length,
        'Content-Disposition': `attachment; filename="qrcode-${qrId}.png"`
    });
    res.end(imgBuffer);
});

module.exports = { createQr, viewMyVisitors, downloadQr };