const ApiError = require("../utils/ApiError.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");
const { adminModel } = require("../models/admin.models.js");
const { regularUserModel } = require("../models/regularUser.models.js");
const { guardModel } = require("../models/guards.models.js");

const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.send(decodedToken._id)
        // This is a simplified user lookup. You might expand this based on the token payload.
        const user = await adminModel.findById(decodedToken?._id) || await regularUserModel.findById(decodedToken?._id) || await guardModel.findById(decodedToken?._id);
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

module.exports = { verifyJWT };