const jwt = require("jsonwebtoken")
module.exports.createToken = async(payload) => {
    const token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    return token;
}