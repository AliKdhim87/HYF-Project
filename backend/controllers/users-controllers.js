const { validationResult } = require("express-validator");
const HttpError = require("../model/http-error");
const User = require("../model/user");

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
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser)
      return next(
        new HttpError("User exists already, please login instead.", 500)
      );

    const createdUser = new User({
      name,
      email,
      image: "https://i.picsum.photos/id/1070/200/300.jpg",
      password,
      places: []
    });

    await createdUser.save();
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Signin up  failed, please try again later.", 500)
    );
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findBuCredantials(email, password);
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

module.exports = { getUsers, signup, login };
