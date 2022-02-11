const {JwtStrategy, ExtractJwt} = require("passport-jwt");
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
opts.issuer = "accounts.examplesoft.com";
opts.audience = "yoursite.net";

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    authService.findOne({id: jwt_payload.sub}, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);
