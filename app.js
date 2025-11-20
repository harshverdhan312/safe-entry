const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require('express-session');
const flash = require('connect-flash');
const { adminModel } = require("./models/admin.models.js");
const { regularUserModel } = require("./models/regularUser.models.js");
const { guardModel } = require("./models/guards.models.js");


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Session and Flash Middleware Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'a-very-strong-secret-key', // It's best to move this to your .env file
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if you are using HTTPS
}));

app.use(flash());

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Page Rendering Routes
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("loginPage");
});

app.get("/signup", (req, res) => {
    res.render("signupPage");
});

// NOTE: These dashboard routes are currently open. 
// In a real application, you would add authentication middleware here
// to ensure only logged-in users of the correct type can access them.
app.get("/dashboard/admin", async (req, res) => {
    const admin = await adminModel.findOne({ uid: req.query.userId });
    const newUserCredentials = req.flash('newUserCredentials')[0]; // Get the flash message
    res.render("adminDashboard", { 
        user: admin, 
        userId: req.query.userId,
        newUser: newUserCredentials // Pass credentials to the view
    });
});
app.get("/dashboard/user", async (req, res) => {
    const user = await regularUserModel.findOne({ ruid: req.query.userId });
    res.render("regularUserDashboard", { 
        user: user, 
        userId: req.query.userId 
    });
});
app.get("/dashboard/guard", async (req, res) => {
    const guard = await guardModel.findOne({ guid: req.query.userId });
    res.render("guardDashboard", { 
        user: guard, 
        userId: req.query.userId 
    });
});

// API Routers
const userRouter = require('./routes/user.routes.js');
const adminRouter = require('./routes/admin.routes.js');
const regularUserRouter = require('./routes/regularUser.routes.js');
const guardRouter = require('./routes/guard.routes.js');
const healthCheckRouter = require('./routes/healthCheck.routes.js');


// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/regular", regularUserRouter);
app.use("/api/v1/guard", guardRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);

module.exports = {app}
