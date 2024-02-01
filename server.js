// Import Required Files
const app = require('./app');


// Server will run on certain port 
const port = process.env.PORT || 5000;


// Application listen to the port for instruction 
app.listen(port, () => {
    console.log('server is running')
})

