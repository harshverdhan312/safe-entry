const { asyncHandler } = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { adminModel } = require("../models/admin.models.js");
const { guardModel } = require("../models/guards.models.js");
const { regularUserModel } = require("../models/regularUser.models.js");
const { generateCustomId } = require("../utils/idGenerator.js");
const mongoose = require("mongoose");

// This can be expanded with JWT for access/refresh tokens
const generateTokens = async (user) => {
    // For now, returning a simple message. Implement JWT token generation here.
    return { accessToken: "dummy-access-token", refreshToken: "dummy-refresh-token" };
};

const registerAdmin = asyncHandler(async (req, res) => {
    // Only Admins can self-register through this endpoint
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => typeof field === 'string' && field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Generate a unique admin ID
    const uid = generateCustomId('01', 1000, 9999);

    const existingAdmin = await adminModel.findOne({ $or: [{ uid: uid }, { email }] });
    if (existingAdmin) {
        throw new ApiError(409, "Admin with this ID or email already exists");
    }

    // The password will be hashed automatically by the pre-save hook in the model
    const admin = await adminModel.create({
        uid,
        name,
        email,
        password,
    });

    const createdAdmin = await adminModel.findById(admin._id).select("-password");

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin");
    }

    // Redirect to the admin dashboard with the new ID after successful registration
    return res.redirect(`/dashboard/admin?userId=${uid}`);
});

const loginUser = asyncHandler(async (req, res) => {
    const { userId, password, userType } = req.body; // userType can be 'admin', 'guard', or 'regular'

    if (!userId || !password || !userType) {
        throw new ApiError(400, "User ID, password, and user type are required");
    }

    let user;
    let UserModel;
    let idField;

    switch (userType.toLowerCase()) {
        case 'admin':
            UserModel = adminModel;
            idField = 'uid';
            break;
        case 'guard':
            UserModel = guardModel;
            idField = 'guid';
            break;
        case 'regular':
            UserModel = regularUserModel;
            idField = 'ruid';
            break;
        default:
            throw new ApiError(400, "Invalid user type");
    }

    user = await UserModel.findOne({ [idField]: userId });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // In a real app, you would compare hashed passwords
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const accessToken = user.generateAccessToken();

    const options = {
        httpOnly: true,
        secure: true
    }

    // Redirect to the appropriate dashboard based on user type
    switch (userType.toLowerCase()) {
        case 'admin':
            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .redirect(`/dashboard/admin?userId=${user.uid}`);
        case 'guard':
            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .redirect(`/dashboard/guard?userId=${user.guid}`);
        case 'regular':
            return res
                .status(200)
                .cookie("accessToken", accessToken, options,)
                .redirect(`/dashboard/user?userId=${user._id.toString()}`);
        default:
            return res.redirect('/login'); // Fallback to login
    }
});

const changePassword = asyncHandler(async (req, res) => {
    // This assumes the user is logged in. In a real app, user ID and type
    // would come from a JWT token, not the request body.
    const { userId, userType, oldPassword, newPassword } = req.body;

    if (!userId || !userType || !oldPassword || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }

    let UserModel;
    let idField;

    switch (userType.toLowerCase()) {
        case 'admin': UserModel = adminModel; idField = 'uid'; break;
        case 'guard': UserModel = guardModel; idField = 'guid'; break;
        case 'regular': UserModel = regularUserModel; idField = 'ruid'; break;
        default: throw new ApiError(400, "Invalid user type");
    }

    const user = await UserModel.findOne({ [idField]: userId });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Compare the provided old password with the hashed password in the database
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid old password");
    }

    user.password = newPassword; // Set the new password
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
    // In a real app, user ID and type would come from an authenticated session/JWT
    const { userId, userType, ...updateData } = req.body;

    if (!userId || !userType) {
        throw new ApiError(400, "User ID and User Type are required.");
    }

    let UserModel;
    let idField;

    switch (userType.toLowerCase()) {
        case 'admin': UserModel = adminModel; idField = 'uid'; break;
        case 'guard': UserModel = guardModel; idField = 'guid'; break;
        case 'regular': UserModel = regularUserModel; idField = 'ruid'; break;
        default: throw new ApiError(400, "Invalid user type");
    }

    // Filter out fields that shouldn't be updated this way
    delete updateData.password;
    delete updateData.uid;
    delete updateData.guid;
    delete updateData.ruid;

    const updatedUser = await UserModel.findOneAndUpdate(
        { [idField]: userId },
        { $set: updateData },
        { new: true }
    ).select("-password");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully."));
});

module.exports = { registerAdmin, loginUser, changePassword, updateUserDetails };