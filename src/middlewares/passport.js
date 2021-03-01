const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { UserModel } = require("../services/user");
const { generateUserFromFacebook } = require("../utils/auth/oauthUsers");
const { generateTokens } = require("../utils/auth/jwt");

const {
	FACEBOOK_APP_ID,
	FACEBOOK_APP_SECRET,
	FACEBOOK_REDIRECT_URL,
} = process.env;
passport.use(
	"facebook",
	new FacebookStrategy(
		{
			clientID: FACEBOOK_APP_ID,
			clientSecret: FACEBOOK_APP_SECRET,
			callbackURL: FACEBOOK_REDIRECT_URL,
			profileFields: ["id", "displayName", "photos", "emails", "name"],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const user = await UserModel.findOne({
					facebookId: profile.id,
				});

				if (user) {
					const tokens = await generateTokens(user);
					return done(null, { user, tokens });
				}

				const newUser = new UserModel(
					generateUserFromFacebook(profile)
				);
				await newUser.save();
				const tokens = await generateTokens(newUser);
				done(null, { user: newUser, tokens });
			} catch (error) {
				console.log("Facebook passportjs error: ", error);
				done(error, false);
			}
		}
	)
);

passport.serializeUser(function (user, next) {
	next(null, user);
});
