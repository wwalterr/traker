module.exports = {
  express: {
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    protocol: "http"
  },
  application: {
    days: 14
  },
  cookie: {
    secret: "6a681d29-d6ae-48bd-b6d3-5d617256" // 32-Bits key
  },
  trakt: {
    clientId: "5b1a1fba450c9c4d677623818be7583890b0699bc348ba5cbffbb50a3c0d2cbd",
    clientSecret: "1c8ee28dfdec965da6596c02db477f6ca41aaa036db29432e054fa6bf9c66e8b",
    redirectUri: `http://0.0.0.0:${process.env.PORT || 3000}/authenticate`, // Needs to be registered at the application on Trakt
    responseType: "code",
    apiUrl: "https://api.trakt.tv/", // Keep the slash at the end
    siteUrl: "https://trakt.tv/", // Keep the slash at the end
    authorizeEndpoint: "oauth/authorize", // Don't place a slash at the end
    tokenEndpoint: "oauth/token", // Don't place a slash at the end
    grantTypeCode: "authorization_code",
    apiVersion: "2"
  },
  tmdb: {
    apiKey3: "d66765d98f9a0c53bc12cd6f3c6743ef",
    apiKey4: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjY3NjVkOThmOWEwYzUzYmMxMmNkNmYzYzY3NDNlZiIsInN1YiI6IjVlMmVmMjA2YzU2ZDJkMDAxYTRlMTA2MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.c-DxrGdGHns8iHiWz1OoNMwE5OEAvswYKyJM_DvO3bg",
    apiUrl: "https://api.themoviedb.org/3/", // Keep the slash at the end
    showEndpoint: "tv" // Don't place a slash at the end
  },
  omdb: {
    apiKey: "cdbdd39f",
    apiUrl: "http://www.omdbapi.com/",
    apiPosterUrl: "http://img.omdbapi.com/"
  }
};
