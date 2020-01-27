const axios = require("axios");

const info = async ({ apiUrl, apiKey, showId }) => {
  // Show id is a valid id from IMDB

  try {
    const _info = await axios({
      url: `${apiUrl}?apikey=${apiKey}&i=${showId}`,
      method: "GET"
    });

    return _info.data;
  } catch (error) {
    console.log(`Error: ${error}`);

    throw error;
  }
};

const poster = async ({ apiPosterUrl, apiKey, showId }) => {
  // Show id is a valid id from IMDB

  try {
    const _poster = await axios({
      url: `${apiPosterUrl}?apikey=${apiKey}&i=${showId}`,
      method: "GET"
    });

    return _poster.data; // Binary
  } catch (error) {
    console.log(`Error: ${error}`);

    throw error;
  }
};

module.exports = { info, poster };
