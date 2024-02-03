// packages
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");


// Import files
const userRoute = require('./routers/user.route')


// Create app
const app = express();


// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());


// Routes
// Base route
app.get('/', (req,res) => {
    res.send('dhruva parisad is working');
});

// User account route
app.use('/api/v1/user', userRoute);


module.exports = app;