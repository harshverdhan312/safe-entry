const { asyncHandler } = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse.js");

const healthCheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { status: "OK" }, "Health check successful"));
});

module.exports = { healthCheck };