const axios = require("axios");

const login = async () => {
  try {
    const authentication = await axios({
      method: "POST",
      url: "https://api.thetvdb.com/login",
      data: {
        apikey: "e87cbda4689d7f5b68218bf8510f05a8",
        userKey: "5E36F969C3ADB3.97231761",
        username: "sphinxs",
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return authentication.data;
  } catch (error) {
    console.log(error.message);
  }
};

const poster = async ({ id, token, promise = false }) => {
  try {
    const posterPromisse = axios({
      method: "GET",
      url: `https://api.thetvdb.com/series/${id}/images/query?keyType=poster`,
      headers: {
        "Accept-Language": "en",
        authorization: `Bearer ${token}`,
      },
    }).catch((error) => {
      console.log(error.message);
    });

    if (promise) return posterPromisse;

    const poster = await posterPromisse;

    return poster.data;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  login,
  poster,
};
