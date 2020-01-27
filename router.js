const express = require("express");

const bodyParser = require("body-parser");

const settings = require("./settings");

const trakt = require("./trakt");

const tmdb = require("./tmdb");

const omdb = require("./omdb");

// Router
const router = express.Router();

// Middleware
const urlEncoded = bodyParser.urlencoded({ extended: true });

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
      maxAge: 7.776e6,
      httpOnly: false,
      signed: true
    });

    response.json({ status: "authenticated" });
  } catch (error) {
    console.log(`Error: ${error}`);

    throw error;
  }
});

router.get("/", async (request, response) => {
  const authentication = request.signedCookies.authentication
    ? JSON.parse(request.signedCookies.authentication)
    : null;

  // const myShowsPremieres = await trakt.myShowsPremieres({
  //   ...settings.trakt,
  //   days: 4,
  //   accessToken: authentication.access_token
  // });
  //
  // console.log(myShowsPremieres);

  // const allShowsPremieres = await trakt.allShowsPremieres({
  //   ...settings.trakt,
  //   days: 4
  // })
  //
  // console.log(allShowsPremieres)

  // const hypedShows = await trakt.hypedShows({
  //   ...settings.trakt,
  //   trending: true
  // })
  //
  // console.log(hypedShows)

  // const showSummary = await trakt.showSummary({
  //   ...settings.trakt,
  //   showId: 2340
  // });
  //
  // console.log(showSummary);

  // const showImages = await tmdb.showImages({ ...settings.tmdb, showId: 71890 });
  //
  // console.log(showImages);

  // const showInfo = await tmdb.showInfo({ ...settings.tmdb, showId: 71890 });
  //
  // console.log(showInfo);

  // const omdbInfo = await omdb.info({ ...settings.omdb, showId: "tt0094481" });
  //
  // console.log(omdbInfo);

  // const omdbPoster = await omdb.poster({ ...settings.omdb, showId: "tt0094481" });
  //
  // console.log(omdbPoster);

  response.render("home");
});

module.exports = router;
