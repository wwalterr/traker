const express = require("express");

const bodyParser = require("body-parser");

const settings = require("../settings");

const trakt = require("./trakt");

const tvdb = require("./tvdb");

// Router
const router = express.Router();

// Middleware
const urlEncoded = bodyParser.urlencoded({
  extended: true
});

// Route
router.get("/authenticate", urlEncoded, async (request, response) => {
  // Create an authorization URL, access the URL, authenticate at
  // the Trakt and then Trakt will redirect to this route with a
  // code at the query string

  try {
    const authentication = await trakt.exchangeCode({
      ...settings.trakt,
      ...request.query // Expect a OAuth 2 code at the query string
    });

    response.cookie("authentication", JSON.stringify(authentication), {
      maxAge: 7.776e6, // Three months
      httpOnly: false,
      signed: false
    });

    response.redirect("/");

    // response.json({ status: "authenticated" });
  } catch (error) {
    console.log(`Error: ${error}`);

    throw error;
  }
});

const generateShowsPremieres = showsPremieres => {
  let _showsPremieres = [];

  const dateNow = new Date();

  for (let showPremiere of showsPremieres) {
    const daysUntilPremiere = showPremiere.first_aired
      ? Math.ceil(
          Math.abs(new Date() - new Date(showPremiere.first_aired)) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    // console.log(showPremiere);

    _showsPremieres.push({
      firstAired: new Date(showPremiere.first_aired).toDateString(),
      season: showPremiere.episode.season,
      episode: showPremiere.episode.episode,
      title: showPremiere.show.title,
      daysUntilPremiere,
      showIds: showPremiere.show.ids
    });
  }

  const _showsPremieresDuplicate = _showsPremieres.reduce((list, current) => {
    if (!list.some(_object => _object.title === current.title))
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
    : settings.application.days;

  let mediaPremieres = [];

  if (authentication) {
    try {
      const myShowsPremieres = await trakt.myShowsPremieres({
        ...settings.trakt,
        days: days,
        authenticated: Boolean(authentication),
        accessToken: authentication.access_token
      });

      mediaPremieres = generateShowsPremieres(myShowsPremieres);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  } else {
    try {
      const allShowsPremieres = await trakt.allShowsPremieres({
        ...settings.trakt,
        days: days,
        authenticated: Boolean(authentication)
      });

      mediaPremieres = generateShowsPremieres(allShowsPremieres);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  let tvdbAuthentication = "";

  try {
    _tvdbAuthentication = await tvdb.login();
    tvdbAuthentication = _tvdbAuthentication.token;
  } catch (error) {
    console.log(error);
  }

  let postersPromises = mediaPremieres
    .map((showPremiere, index) => {
      if (showPremiere.showIds.tvdb)
        return {
          index,
          promise: tvdb.poster({
            id: showPremiere.showIds.tvdb,
            token: tvdbAuthentication,
            promise: true
          })
        };
      return null;
    })
    .filter(posterPromise => {
      return posterPromise ? posterPromise : null;
    });

  Promise.all(
    postersPromises.map((poster, index) =>
      poster.promise.then(data => ({
        ...poster,
        data
      }))
    )
  )
    .then(results => {
      // console.log(results[3].data.data.posters[0].file_path)
      // console.log(results)
      const posters = results.map(({ data, index }) => {
        if (data) {
          const postersArray = data.data.data;

          if (postersArray.length) {
            const indexPoster = Math.floor(
              Math.random() * (postersArray.length - 1)
            );
            return {
              url: `https://thetvdb.com/banners/${postersArray[indexPoster].fileName}`,
              index
            };
          }
        }

        return { url: null, index };
      });

      // console.log(posters)
      for (let poster of posters) {
        mediaPremieres[poster.index]["poster"] = poster.url;
      }
    })
    .finally(r => {
      response.render("home", {
        mediaPremieres,
        authorizeUrl: trakt.createAuthorizeUrl(settings.trakt),
        days: days,
        authenticated: Boolean(authentication)
      });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/logout", (request, response) => {
  response.clearCookie("authentication");

  response.clearCookie("mediaPremieres");

  response.redirect("/");
});

router.use(bodyParser.json());

module.exports = router;
