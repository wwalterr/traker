const settings = require("../settings");

const axios = require("axios");

const login = async () => {
  try {
    const authentication = await axios({
      method: "POST",
      url: "https://api.thetvdb.com/login",
      data: {
        apikey: settings.tvdb.apikey,
        userKey: settings.tvdb.userKey,
        username: settings.tvdb.username,
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
