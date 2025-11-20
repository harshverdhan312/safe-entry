const { asyncHandler } = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { qrCodeModel } = require("../models/qrScan.models.js");
const { regularUserModel } = require("../models/regularUser.models.js");

const scanQrCode = asyncHandler(async (req, res) => {
    const { qrId, guardId } = req.body;

    if (!qrId || !guardId) {
        throw new ApiError(400, "QR ID and Guard ID are required");
    }

    const qrRecord = await qrCodeModel.findOne({ qrId: qrId });

    if (!qrRecord) {
        throw new ApiError(404, "QR Code not found or invalid");
    }

    if (qrRecord.scannedBy) {
        throw new ApiError(400, "This QR code has already been scanned");
    }

    qrRecord.scannedBy = guardId;
    qrRecord.scannedAt = new Date();
    await qrRecord.save();

    // Increment the visitor count for the user who created the QR code
    await regularUserModel.findByIdAndUpdate(qrRecord.createdBy, {
        $inc: { numberOfVisitors: 1 }
    });

    return res.status(200).json(new ApiResponse(200, qrRecord, "QR Code scanned successfully"));
});

module.exports = { scanQrCode };