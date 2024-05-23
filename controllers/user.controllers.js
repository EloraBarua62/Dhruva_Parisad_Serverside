const User = require("../models/User");
const { createToken } = require("../utils/createToken");
const { responseReturn } = require("../utils/response");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");


// userControllers class is defined and called
class userControllers {
  // user signup
  signup = async (req, res) => {
    let { name, email, role, password = 0 } = req.body;
    console.log(email)
    try {
      const userFound = await User.findOne({ email });
      if (userFound) {
        responseReturn(res, 404, {
          error: "Email already exist, try with another email",
        });
      } 
      else {
        // Generate pin number for role: principal
        let pin_number = '';
        if (role === "principal") {
          password = Math.floor(Math.random() * (600000 - 500000)) + 500000;
          password = password.toString();
          pin_number = password;
        }

        // Add new user
         const createUser = await User.create({
            name,
            email,
            role,
            password: await bcrypt.hash(password, 10),
          });
       
          // if role: student, admin => send cookie
          // if role: principal  => send mail
        if (role !== "principal") {
          const token = await createToken({
            email: email,
            role: createUser.role,
          });
          res.cookie("accessToken", token, {
            httpOnly: false,
            SameSite: None,
            expires: new Date(Date.now() + 7 * 24 * 60 * 1000),
          });
        }
        else{
          const message = `Your PIN number is ${pin_number}. Login in our website with this number. Thank you.`;
          await sendEmail({
            email,
            name,
            subject: "Welcome to Dhruva Parishad",
            message,
          });
        }

        const userInfo = {
          name: createUser.name,
          email: createUser.email,
          role: createUser.role
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
            httpOnly: false,
            sameSite: 'none',
            secure: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 1000),
          });
          const userInfo = {
            name: user.name,
            email: user.email,
            role: user.role,
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

 
 
  // Forgot Password
  forgot_password = async (req, res) => {
    const { email } = req.body;
    const userFound = await User.findOne({ email });

    if (userFound) {
      const resetToken = userFound.createResetPasswordToken();
      await userFound.save({ validateBeforeSave: false });
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/user/reset-password/${resetToken}`;
      // const message = `We have received a password reset request. Please use the below link to reset your password. This link will be valid for 10 minutes`;
      const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl} \n\n This link will be valid for 10 minutes`;

      try {
        // await sendEmail({
        //   email: userFound.email,
        //   subject: "Password change request received",
        //   message: message,
        //   resetUrl,
        // });
        responseReturn(res, 200, {
          message: "Password reset link send to the user email",
        });
      } catch (error) {
        userFound.passwordResetToken = undefined;
        userFound.passwordResetTokenExpires = undefined;
        userFound.save({ validateBeforeSave: false });
        console.log(resetUrl);
        responseReturn(res, 500, { error: error.message });
      }
    } else {
      responseReturn(res, 404, {
        error: "You are not a registered user, Please create an account",
      });
    }
  };

  // Forgot Password
  reset_password = async (req, res) => {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (user) {
      const pass = await bcrypt.hash(req.body.password, 10);
      user.password = pass;
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      user.passwordChangedAt = Date.now();

      user.save();

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
      responseReturn(res, 200, {
        userInfo,
        message: "New password has been set successfully",
      });
    } else {
      responseReturn(res, 404, {
        error: "Token is ivalid or has expired",
      });
    }
  };

  // Principal information fetch
  principal_info = async (req, res) => {
    const { page, parPage } = req.query;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);
    try {
      const principal_info = await User.find({ role: "principal" })
        .skip(skipPage)
        .limit(parPage);

      const totalData = principal_info.length;
      console.log(principal_info, totalData);
      if (totalData > 0) {
        responseReturn(res, 200, {
          principal_info,
          totalData,
          message: "Principal info loaded successfully",
        });
      } else {
        responseReturn(res, 404, { error: "Principal info list is empty" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new userControllers();
