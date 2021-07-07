const axios = require("axios");

const showImages = async ({ apiUrl, showEndpoint, showId, apiKey3, promise = false }) => {
  // Show id is a valid id from The Movie Database

  try {
    const _showImagesPromise = axios({
      url: `${apiUrl}${showEndpoint}/${showId}/images?api_key=${apiKey3}`,
      method: "GET"
    }).catch(error => {
			console.log(error)
		})

    if(promise)
      return _showImagesPromise

    const _showImages = await _showImagesPromise;

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
