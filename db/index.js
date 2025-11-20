const mongoose = require('mongoose');
const { DB_NAME } = require('../constants.js');
const dotenv = require("dotenv")

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        console.log('Connecting to MongoDB at:', `${process.env.MONGODB_URI}${DB_NAME}`);

    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

module.exports = {connectDB};