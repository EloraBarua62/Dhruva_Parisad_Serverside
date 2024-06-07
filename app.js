// packages
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import files
const userRoute = require("./routers/user.route");
const studentRoute = require("./routers/student.route");
const resultRoute = require("./routers/result.route");
const schoolRoute = require("./routers/school.route");
const newsRoute = require("./routers/news.route");

// Create app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["https://dhruva-parisad-clientside.vercel.app"],  
    credentials: true,
  })
);
  //  origin: ["http://localhost:3000"], 
app.use(cookieParser());

// Routes
// Base route
app.get("/", (req, res) => {
  res.send("dhruva parisad is working");
});

// User account route
app.use("/api/v1/user", userRoute);
app.use("/api/v1/student", studentRoute);
app.use("/api/v1/result", resultRoute);
app.use("/api/v1/school", schoolRoute);
app.use("/api/v1/news", newsRoute);

module.exports = app;
