const User = require("../models/User");
const { createToken } = require("../utils/createToken");
const { responseReturn } = require("../utils/response");
const bcrypt = require("bcrypt")

// userControllers class is defined and called
class userControllers {

    // user signup
    signup = async(req, res) => {
        const {name, email, password} = req.body;
        

        try {
            const userFound = await User.findOne({email});
            
            if(userFound){
                responseReturn(res, 404, {error:"Email already exist, try with another email"});
            }
            else{
                
                const createUser = await User.create({
                  name,
                  email,
                  password: await bcrypt.hash(password, 10)        
                }); 
                const token = await createToken({email:email, role:createUser.role});
                res.cookie("accessToken" , token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 1000)
                });

                const userInfo = {
                  name: createUser.name,
                  email: createUser.email,
                  role: createUser.role,
                };
                responseReturn(res, 201, {
                  userInfo,
                  message: "User signup successfull",
                });              
            }
        } catch (error) {
            responseReturn(res, 500, {error: error.message});

        }
    }
}

module.exports = new userControllers();