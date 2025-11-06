const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { GOOGLEConfig } = require("../config/config");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLEConfig.clientID,
      clientSecret: GOOGLEConfig.clientSecret,
      callbackURL: GOOGLEConfig.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const AppDataSource = require("./database");
        const userRepository = AppDataSource.getRepository("User");

        // First, check if user exists with this googleId
        let user = await userRepository.findOne({
          where: { googleId: profile.id },
        });

        if (user) {
          return done(null, user);
        }

        // If no user with googleId, check if email already exists
        let existingUser = await userRepository.findOne({
          where: { email: profile.emails[0].value },
        });

        if (existingUser) {
          // Update existing user with googleId
          existingUser.googleId = profile.id;
          await userRepository.save(existingUser);
          return done(null, existingUser);
        }

        // No user exists - create new one
        let newUser = userRepository.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          password: null,
        });
        await userRepository.save(newUser);

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const AppDataSource = require("./database");
    const userRepository = AppDataSource.getRepository("User");
    const user = await userRepository.findOne({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
