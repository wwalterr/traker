require("dotenv").config();

const express = require("express");

const trakt = require("./trakt");

const tvdb = require("./tvdb");

// Router
const router = express.Router();

// Middleware
const urlEncoded = express.urlencoded({
  extended: true,
});

// Route

const TRAKT_SETTINGS = {
  clientId: process.env.TRAKT_CLIENT_ID,
  clientSecret: process.env.TRAKT_CLIENT_SECRET,
  redirectUri: process.env.TRAKT_REDIRECT_URI,
  responseType: process.env.TRAKT_RESPONSE_TYPE,
  apiUrl: process.env.TRAKT_API_URL,
  siteUrl: process.env.TRAKT_SITE_URL,
  authorizationEndpoint: process.env.TRAKT_AUTHORIZATION_ENDPOINT,
  tokenEndpoint: process.env.TRAKT_TOKEN_ENDPOINT,
  grantTypeCode: process.env.TRAKT_GRANT_TYPE_CODE,
  apiVersion: parseInt(process.env.TRAKT_API_VERSION),
};

router.get("/authenticate", urlEncoded, async (request, response) => {
  // Create an authorization URL, access the URL, authenticate on
  // Trakt and then Trakt will redirect to this route with query
  // string

  try {
    const authentication = await trakt.exchangeCode({
      ...TRAKT_SETTINGS,
      ...request.query, // Expect a OAuth 2 code at the query string
    });

    response.cookie("authentication", JSON.stringify(authentication), {
      maxAge: 7.776e6, // Three months
      httpOnly: false,
      signed: false,
    });

    response.redirect("/");

    // response.json({ status: "authenticated" });
  } catch (error) {
    console.log(error.message);

    throw error;
  }
});

const generateShowsPremieres = (showsPremieres) => {
  let _showsPremieres = [];

  for (let showPremiere of showsPremieres) {
    const daysUntilPremiere = showPremiere.first_aired
      ? Math.ceil(
          Math.abs(new Date() - new Date(showPremiere.first_aired)) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    _showsPremieres.push({
      firstAired: new Date(showPremiere.first_aired).toDateString(),
      season: showPremiere.episode.season,
      episode: showPremiere.episode.episode,
      title: showPremiere.show.title,
      daysUntilPremiere,
      showIds: showPremiere.show.ids,
    });
  }

  const _showsPremieresDuplicate = _showsPremieres.reduce((list, current) => {
    if (!list.some((_object) => _object.title === current.title))
      list.push(current);

    return list;
  }, []);

  const _showsPremieresSorted = _showsPremieresDuplicate.sort((a, b) => {
    return a.daysUntilPremiere <= b.daysUntilPremiere;
  });

  return _showsPremieresSorted;
};

router.get("/", urlEncoded, async (request, response) => {
  const authentication = request.cookies.authentication
    ? JSON.parse(request.cookies.authentication)
    : null;

  const days = request.query.days
    ? request.query.days
    : parseInt(process.env.TRACK_DAYS);

  let mediaPremieres = [];

  if (authentication) {
    try {
      const myShowsPremieres = await trakt.myShowsPremieres({
        ...TRAKT_SETTINGS,
        days: days,
        authenticated: Boolean(authentication),
        accessToken: authentication.access_token,
      });

      mediaPremieres = generateShowsPremieres(myShowsPremieres);
    } catch (error) {
      console.log(error.message);
    }
  } else {
    try {
      const allShowsPremieres = await trakt.allShowsPremieres({
        ...TRAKT_SETTINGS,
        days: days,
        authenticated: Boolean(authentication),
      });

      mediaPremieres = generateShowsPremieres(allShowsPremieres);
    } catch (error) {
      console.log(error.message);
    }
  }

  let tvdbAuthentication = "";

  try {
    _tvdbAuthentication = await tvdb.login();

    tvdbAuthentication = _tvdbAuthentication.token;
  } catch (error) {
    // console.log(error.message);
  }

  let postersPromises = mediaPremieres
    .map((showPremiere, index) => {
      if (showPremiere.showIds.tvdb)
        return {
          index,
          promise: tvdb.poster({
            id: showPremiere.showIds.tvdb,
            token: tvdbAuthentication,
            promise: true,
          }),
        };

      return null;
    })
    .filter((posterPromise) => {
      return posterPromise ? posterPromise : null;
    });

  Promise.all(
    postersPromises.map((poster, index) =>
      poster.promise.then((data) => ({
        ...poster,
        data,
      }))
    )
  )
    .then((results) => {
      const posters = results.map(({ data, index }) => {
        if (data) {
          const postersArray = data.data.data;

          if (postersArray.length) {
            const indexPoster = Math.floor(
              Math.random() * (postersArray.length - 1)
            );
            return {
              url: `https://thetvdb.com/banners/${postersArray[indexPoster].fileName}`,
              index,
            };
          }
        }

        return { url: null, index };
      });

      for (let poster of posters) {
        mediaPremieres[poster.index]["poster"] = poster.url;
      }
    })
    .finally((_response) => {
      response.render("home", {
        mediaPremieres,
        authorizeUrl: trakt.createAuthorizationUrl(TRAKT_SETTINGS),
        days: days,
        authenticated: Boolean(authentication),
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

router.get("/logout", (request, response) => {
  response.clearCookie("authentication");

  response.clearCookie("mediaPremieres");

  response.redirect("/");
});

router.use(express.json());

module.exports = router;
