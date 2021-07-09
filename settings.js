module.exports = {
  trakt: {
    // Application trakt.tv/oauth/applications/
    clientId: "5b1a1fba450c9c4d677623818be7583890b0699bc348ba5cbffbb50a3c0d2cbd",
    clientSecret: "1c8ee28dfdec965da6596c02db477f6ca41aaa036db29432e054fa6bf9c66e8b",
    redirectUri: `https://ttrakerr.herokuapp.com/authenticate`, // Needs to be registered at the application on Trakt
    responseType: "code",
    apiUrl: "https://api.trakt.tv/", // Keep the slash at the end
    siteUrl: "https://trakt.tv/", // Keep the slash at the end
    authorizationEndpoint: "oauth/authorize", // Don't place a slash at the end
    tokenEndpoint: "oauth/token", // Don't place a slash at the end
    grantTypeCode: "authorization_code",
    apiVersion: "2",
  },
  tvdb: {
    apikey: "e87cbda4689d7f5b68218bf8510f05a8",
    userKey: "5E36F969C3ADB3.97231761",
    username: "sphinxs",
  },
};
