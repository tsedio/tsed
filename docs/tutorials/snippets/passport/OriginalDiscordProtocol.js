const {Strategy} = require("passport-discord");

passport.use(
  new Strategy(
    {
      clientID: "id",
      clientSecret: "secret",
      callbackURL: "callbackURL"
    },
    (accessToken, refreshToken, profile, cb) => {
      authService.findOrCreate({discordId: profile.id}, cb);
    }
  )
);
