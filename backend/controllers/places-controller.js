const mongoose = require("mongoose");
const HttpError = require("../model/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const Place = require("../model/place");
const User = require("../model/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  try {
    const place = await Place.findById(placeId);
    if (!place)
      return next(
        new HttpError("Could not find a place for the provided id.", 404)
      );

    res.json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Somthing went wrong, could not find a place.", 500)
    );
  }
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate("places");
    if (!userWithPlaces || userWithPlaces.places.length === 0)
      return next(
        new HttpError("Could not find a place for the provided user id.", 404)
      );

    res.json({
      userWithPlaces: userWithPlaces.places.map(place =>
        place.toObject({ getters: true })
      )
    });
  } catch (error) {
    return next(
      new HttpError(
        "Somthing went wrong, could not find a place for the provided id.",
        500
      )
    );
  }
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return next(
      new Error("Invalid input passed, please check your data.", 422)
    );

  const { title, description, address, creator } = req.body;
  // Here I change the coordinatis to object and also reverse the lng becaouse I useed the mapbox  geocode by default it geve us an array [lat, lng].
  let changeCoordinates;
  let coordinates;
  try {
    changeCoordinates = await getCoordsForAddress(address);
    coordinates = {
      lng: changeCoordinates[1],
      lat: changeCoordinates[0]
    };
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "https://i.picsum.photos/id/500/500/500.jpg",
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Creating place failed, please try agen", 500));
  }

  if (!user)
    return next(new HttpError("Could not find user for provided id!", 404));

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
    res.status(201).json({ place: createdPlace });
  } catch (err) {
    const error = new HttpError("Create place failed, place try agin.", 500);
    return next(error);
  }
};

const updatePlaceById = async (req, res, next) => {
  const { title, description } = req.body;

  const error = validationResult(req);
  if (!error.isEmpty())
    return next(
      new Error("Invalid input passed, please check your data.", 422)
    );

  const placeId = req.params.pid;

  try {
    const place = await Place.findById(placeId);

    if (!place)
      return next(
        new HttpError("Could not find a place for the provided  id.", 404)
      );

    place.title = title;
    place.description = description;
    place.save();

    res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not update place", 500)
    );
  }
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(new HttpError("Something went wrong, could not delete place."));
  }

  if (!place)
    return next(new HttpError("Could not find a place for the id.", 404));

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete place.", 500)
    );
  }

  res.status(200).json({ message: "Place deleted" });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById
};
