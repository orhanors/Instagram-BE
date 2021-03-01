const generateUserFromGoogle = (profile) => {
	const newUser = {
		googleId: profile.id,
		name: profile.name.givenName,
		surname: profile.name.familyName,
		email: profile.emails[0].value,
		image: profile.photos[0].value,
	};
	return newUser;
};
const generateUserFromFacebook = (profile) => {
	const newUser = {
		facebookId: profile.id,
		name: profile.name.givenName,
		surname: profile.name.familyName,
		email: profile.emails[0].value,
		image: profile.photos[0].value,
	};

	return newUser;
};

module.exports = {
	generateUserFromFacebook,
	generateUserFromGoogle,
};
