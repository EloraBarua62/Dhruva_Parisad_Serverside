const nodemailer = require("nodemailer");

module.exports.sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: option.email,
    subject: option.subject,
    html: `<div>
              <h4>Hello ${option.name},</h4>
              <p>${option.message}</p>
          </div>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('failed to sent email');
    } else {
      console.log("Email sent");
    }

    return info.response;
  }); 
};