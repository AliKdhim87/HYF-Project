const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const {
  frogetPasswordEmail,
  resetPasswordEmail
} = require("../emails/account");
const HttpError = require("../model/http-error");
const User = require("../model/user");
const config = require("config");
const jwtKey = config.get("JWT_KEY");
var cloudinary = require("../uploads/cloudinary");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 500)
    );
  }
  res
    .status(200)
    .json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty())
    return next(
      new Error("Invalid input passed, please check your data.", 422)
    );
  const { name, email, password } = req.body;
  let createdUser;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser)
      return next(
        new HttpError("User exists already, please login instead.", 422)
      );
    // upload the image first to the cloudinary than I saved the image url on mongodb
    const result = await cloudinary.uploader.upload(req.file.path);

    createdUser = new User({
      name,
      email,
      image: result.url,
      password,
      places: []
    });

    await createdUser.save();
  } catch (error) {
    return next(
      new HttpError("Signin up  failed, please try again later.", 500)
    );
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email, token },
      jwtKey,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try agein later", 500)
    );
  }
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findBuCredantials(email, password);
  } catch (error) {
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email, token },
      jwtKey,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Loggin in failed, please try agein later", 500));
  }
  res
    .status(201)
    .json({ userId: existingUser.id, email: existingUser.email, token });
};


const getUser = async (req, res, next) => {
  let user;

  try {
    user = await User.findById(req.params.userId, "name image");
  } catch (error) {
    return next(
      new HttpError("Fetching user failed, please try again later.", 500)
    );
  }
  res
    .status(200)
    .json({ user: user.toObject({ getters: true })});
};

const updateUser = async (req, res, next) => {
  let user;
  let url;

  if(req.params.userId !== req.userData.userId){
    return next(
      new HttpError("Not authorized.", 401)
    );
  }

  if(req.file){
    try{
      const result = await cloudinary.uploader.upload(req.file.path);
      url = result.url;
    } catch {
      return next(
        new HttpError("Updating user failed, please try again later.", 500)
      );
    }
  }

  try {
    user = await User.findById(req.params.userId);
    user.name = req.body.name || user.name;
    user.image = url || user.image;
    await user.save();
  } catch {
    return next(
      new HttpError("Updating user failed, please try again later.", 500)
    );
  }
  res
    .status(200)
    .json({ user: {name: user.name, image: user.image}});
};

// @route POST api/users/recover
// @desc Recover Password - Generates token and Sends password reset email
// @access Public
const forgetPassword = async (req, res, next) => {
  const email = req.body.email;

  const user = await User.findOne({ email });
  try {
    if (!user) {
      return next(
        new HttpError(
          `The email address ${req.body.email} is not associated with any account. Double-check your email address and try again.`,
          401
        )
      );
    }
    //Generate and set password reset token
    user.generatePasswordReset();
    // Save the updated user object
    user.save();
    // send email
    let link = req.headers.origin + "/resetpassword/" + user.resetPasswordToken;

    frogetPasswordEmail(user.name, user.email, link);
    res.status(200).json({
      message: "A reset email has been sent to " + user.email + "."
    });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};
// @route POST api/users/reset
// @desc Reset Password
// @access Public
const restPassword = async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  try {
    if (!user) {
      return next(
        new HttpError("Password reset token is invalid or has expired.", 401)
      );
    }
    if (req.body.password !== req.body.confirmpassword)
      return next(
        new HttpError(
          "The password and confirmation password do not match.",
          400
        )
      );

    //Set the new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Save
    user.save();
    // send email
    resetPasswordEmail(user.name, user.email);
    res.status(200).json({ message: "Your password has been updated." });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};
module.exports = { getUsers, signup, login, getUser, updateUser, forgetPassword, restPassword };