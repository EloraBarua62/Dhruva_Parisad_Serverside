// Package import
const mongoose = require('mongoose'); 


// Database connection
module.exports.dbConnect = async() => {
    try{
        await mongoose.connect(process.env.DATABASE)
        console.log('database connect');
    }
    catch(error){
        console.log(error.message);
    }
}