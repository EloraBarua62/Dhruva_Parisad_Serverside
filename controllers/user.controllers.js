const User = require("../models/User");
const { createToken } = require("../utils/createToken");
const { responseReturn } = require("../utils/response");
const bcrypt = require("bcrypt");
const validator = require("validator");

// userControllers class is defined and called
class userControllers {
  // user signup
  signup = async (req, res) => {
    let { name, email, role, password = 0 } = req.body;
    try {
      const userFound = await User.findOne({ email });
      
      if (userFound) {
        responseReturn(res, 404, {
          error: "Email already exist, try with another email",
        });
      } 
      else {
        let pin_number = 0;
        if (role === "principal") {
          password = Math.floor(Math.random() * (600000 - 500000)) + 500000;
          password = password.toString();
          pin_number = password;
        }
        const createUser = await User.create({
          name,
          email,
          role,
          password: await bcrypt.hash(password, 10),
        });
        const token = await createToken({
          email: email,
          role: createUser.role,
        });

        if (role !== "principal") {
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 1000),
          });
        }

        const userInfo = {
          name: createUser.name,
          email: createUser.email,
          pin_number,
        };
        responseReturn(res, 201, {
          userInfo,
          message: "User signup successful",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // user login
  login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select("+password");

      // User finding condition
      if (user) {
        const match = await bcrypt.compare(password, user.password);

        // Password matching condition
        if (match) {
          const token = await createToken({
            email: user.email,
            role: user.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 1000),
          });
          const userInfo = {
            name: user.name,
            email: user.email,
          };
          responseReturn(res, 200, { userInfo, message: "Login successful" });
        } else {
          responseReturn(res, 404, { error: "Password wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new userControllers();
