const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const placesRoute = require("./routes/places-route");
const usersRoute = require("./routes/users-route");
const HttpError = require("./model/http-error");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use("/api/places", placesRoute);
app.use("/api/users", usersRoute);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);

  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unKnown error occurred!" });
});
const connectUrl =
  "mongodb+srv://test:Aaa12345@cluster0-m2y4d.mongodb.net/places?retryWrites=true&w=majority";
mongoose
  .connect(connectUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
