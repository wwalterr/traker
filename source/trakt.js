const axios = require("axios");

const createAuthorizationUrl = ({
  siteUrl,
  authorizationEndpoint,
  clientId,
  redirectUri,
  responseType,
}) => {
  return `${siteUrl}${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}`;
};

const exchangeCode = async ({
  apiUrl,
  tokenEndpoint,
  code,
  clientId,
  clientSecret,
  redirectUri,
  grantTypeCode,
}) => {
  try {
    const authentication = await axios({
      url: `${apiUrl}${tokenEndpoint}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: grantTypeCode,
      },
    });

    return authentication.data;
  } catch (error) {
    console.log(error.message);

    throw error;
  }
};

const myShowsPremieres = async ({
  apiUrl,
  days,
  clientId,
  apiVersion,
  accessToken,
}) => {
  const startDate = new Date().toISOString().split("T")[0];

  try {
    const showsPremieres = await axios({
      url: `${apiUrl}calendars/my/shows/premieres/${startDate}/${days}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-key": clientId,
        "trakt-api-version": apiVersion,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return showsPremieres.data;
  } catch (error) {
    console.log(error.message);

    throw error;
  }
};

const allShowsPremieres = async ({ apiUrl, days, clientId, apiVersion }) => {
  const startDate = new Date().toISOString().split("T")[0];

  try {
    const showsPremieres = await axios({
      url: `${apiUrl}calendars/all/shows/premieres/${startDate}/${days}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-key": clientId,
        "trakt-api-version": apiVersion,
      },
    });

    return showsPremieres.data;
  } catch (error) {
    console.log(error.message);

    throw error;
  }
};

const hypedShows = async ({
  apiUrl,
  trending = false,
  clientId,
  apiVersion,
}) => {
  // By default popular shows are queried. Popularity is calculated
  // using the rating percentage and the number of ratings, and trending
  // is calculated using the most shows watched right now

  try {
    const _hypedShows = await axios({
      url: `${apiUrl}shows/${trending ? "trending" : "popular"}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-key": clientId,
        "trakt-api-version": apiVersion,
      },
    });

    return _hypedShows.data;
  } catch (error) {
    console.log(error.message);

    throw error;
  }
};

const showSummary = async ({ apiUrl, showId, clientId, apiVersion }) => {
  // Show ID is a valid ID / show name from Trakt

  try {
    const _showSummary = await axios({
      url: `${apiUrl}shows/${showId}?extended=full`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-key": clientId,
        "trakt-api-version": apiVersion,
      },
    });

    return _showSummary.data;
  } catch (error) {
    console.log(error.message);

    throw error;
  }
};

module.exports = {
  createAuthorizationUrl,
  exchangeCode,
  myShowsPremieres,
  allShowsPremieres,
  hypedShows,
  showSummary,
};
