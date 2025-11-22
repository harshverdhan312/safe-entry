const { asyncHandler } = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { guardModel } = require("../models/guards.models.js");
const { regularUserModel } = require("../models/regularUser.models.js");
const { qrCodeModel } = require("../models/qrScan.models.js");
const { adminModel } = require("../models/admin.models.js");
const { generateCustomId } = require("../utils/idGenerator.js");

const createRegularUser = asyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const { adminId } = req.body; // Assuming adminId is passed to associate the user

    const ruid = generateCustomId('02', 1000, 9999);

    const user = await regularUserModel.create({
        ruid, name, password, contactNumber: null, place: null, numberOfVisitors: null, createdBy: adminId
    });

    // Add user to admin's list
    await adminModel.findByIdAndUpdate(adminId, { $push: { regularUserList: user._id } });

    return res.status(201).json(
        new ApiResponse(201, {
            newUserType: 'User',
            newUserName: name,
            newUserId: ruid,
            newUserPass: password // Note: Sending password back is risky. Consider removing in production.
        }, "Regular user created successfully")
    );
});

const createGuard = asyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const { adminId } = req.body; // This is the MongoDB _id

    const guid = generateCustomId('03', 1000, 9999);

    const guard = await guardModel.create({
        guid, name, password, contact_number: null, device: null, createdBy: adminId
    });

    // Add guard to admin's list
    await adminModel.findByIdAndUpdate(adminId, { $push: { guardsList: guard._id } });

    return res.status(201).json(
        new ApiResponse(201, {
            newUserType: 'Guard',
            newUserName: name,
            newUserId: guid,
            newUserPass: password // Note: Sending password back is risky. Consider removing in production.
        }, "Guard created successfully")
    );
});

const viewAllVisitors = asyncHandler(async (req, res) => {
    // This could mean viewing all regular users
    const allUsers = await regularUserModel.find({}).select("-password");

    return res.status(200).json(
        new ApiResponse(200, allUsers, "All regular users fetched successfully")
    );
});

const checkVisitLogs = asyncHandler(async (req, res) => {
    // This fetches all QR scan events
    const visitLogs = await qrCodeModel.find({})
        .populate("createdBy", "name place")
        .populate("scannedBy", "name");

    if (!visitLogs) {
        throw new ApiError(404, "No visit logs found");
    }

    return res.status(200).json(
        new ApiResponse(200, visitLogs, "Visit logs retrieved successfully")
    );
});

module.exports = {
    createRegularUser,
    createGuard,
    viewAllVisitors,
    checkVisitLogs
};