// packages
const express = require('express');
// const cors = require('cors');


// Create app
const app = express();


// Middleware
app.use(express.json());
// app.use(cors());


// Routes
// Base route
app.get('/', (req,res) => {
    res.send('dhruva parisad is working');
});


module.exports = app;