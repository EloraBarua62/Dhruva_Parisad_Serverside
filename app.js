// packages
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");


// Import files
const userRoute = require('./routers/user.route')
const studentRoute = require('./routers/student.route')
const resultRoute = require('./routers/result.route')


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
app.use('/api/v1/student', studentRoute);
app.use('/api/v1/result', resultRoute);


module.exports = app;