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
              <h3>Dear ${option.name}</h3>
              <p>${option.message}</p>
          </div>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }

    return info.response;
  }); 
};

// const {google} = require('googleapis');
// require("dotenv").config();

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// );

// oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN});

// const sendEmail = async (option) => {
//   const accessToken = await oAuth2Client.getAccessToken();
//     // Transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: process.env.EMAIL_USER,
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//         accessToken: accessToken,
//       },
//     });

//     // Email options
//     const emailOptions = {
//       from: process.env.EMAIL_USER,
//       to: option.email,
//       subject: option.subject,
//       text: option.message,
//       html: `<div>
//               <a href=${option.resetUrl}>Click here to activate your account</a>
//           </div>`,
//     };
//     let info = await transporter.sendMail(emailOptions);
//     console.log(nodemailer.getTestMessageUrl(info))
//     return info.messageId;
// }

// module.exports = sendEmail;
