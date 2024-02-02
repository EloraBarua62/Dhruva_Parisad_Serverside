const User = require("../models/User");
const { responseReturn } = require("../utils/response");
const bcrypt = require("bcrypt")

// userControllers class is defined and called
class userControllers {

    // user signup
    signup = async(req, res) => {
        const {name, email, password} = req.body;
        

        try {
            const userFound = await User.findOne({email});
            console.log(userFound)
            
            if(userFound){
                responseReturn(res, 404, {error:"Email already exist, try with another email"});
            }
            else{
                console.log(name, email, password);
                const createUser = await User.create({
                  name,
                  email,
                  password: await bcrypt.hash(password, 10)        
                }); 
                console.log(createUser)
                responseReturn(res, 201, {message: "User signup successfull"});
               
            }
        } catch (error) {
            responseReturn(res, 500, {error: "Internal server error,please wait"});

        }
    }
}

module.exports = new userControllers();