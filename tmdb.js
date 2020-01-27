const axios = require("axios");

const showImages = async ({ apiUrl, showEndpoint, showId, apiKey3 }) => {
  // Show id is a valid id from The Movie Database

  try {
    const _showImages = await axios({
      url: `${apiUrl}${showEndpoint}/${showId}/images?api_key=${apiKey3}`,
      method: "GET"
    });

    return _showImages.data;
  } catch (error) {
    console.log(`Error: ${error}`);

    throw error;
  }
};

const showInfo = async ({ apiUrl, showEndpoint, showId, apiKey3 }) => {
  // Show id is a valid id from The Movie Database

  try {
    const _showInfo = await axios({
      url: `${apiUrl}${showEndpoint}/${showId}?api_key=${apiKey3}`,
      method: "GET"
    });

    return _showInfo.data;
  } catch (error) {
    console.log(`Error: ${error}`);

    throw error;
  }
};

module.exports = {
  showImages,
  showInfo
};
