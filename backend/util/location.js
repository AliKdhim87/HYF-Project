const axios = require("axios");
const HttpError = require("../model/http-error");
const API_KEY =
  "pk.eyJ1IjoiYWxpa2FkaGltIiwiYSI6ImNrNnVqZmY2YTA1bnQzZW9hOGl5c3owd3gifQ.0nam2ATvhX9r9KW4G36mSg";

async function getCoordsForAddress(address) {
  const res = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${API_KEY}`
  );
  const data = res.data;
  if (!data || data.features.length === 0) {
    const error = new HttpError(
      "Could not find location for the spesified address."
    );
    throw error;
  }

  const coordinates = data.features[1].geometry.coordinates;
  return coordinates;
}
module.exports = getCoordsForAddress;
