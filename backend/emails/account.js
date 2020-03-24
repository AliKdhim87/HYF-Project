const config = require("config");
const sendGridApiKey = config.get("SEND_GRID_API_KEY");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(sendGridApiKey);

const frogetPasswordEmail = async (name, email, link) => {
  const mailOptions = {
    to: email,
    from: "bsilakaymak@gmail.com",
    subject: "Password change request",
    text: `Hi ${name} \n 
       Please click on the following link ${link} to reset your password. \n\n 
       If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};

const resetPasswordEmail = async (name, email) => {
  const mailOptions = {
    to: email,
    from: "bsilakayma@gmail.com",
    subject: "Your password has been changed",
    text: `Hi ${name} \n 
          This is a confirmation that the password for your account ${email} has just been changed.\n`
  };
  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    return new HttpError(error.message, 500);
  }
};

module.exports = {
  frogetPasswordEmail,
  resetPasswordEmail
};
