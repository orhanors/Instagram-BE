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
	const name = profile.name.givenName;
	const surname = profile.name.familyName;
	const email = profile.emails[0].value;
	const newUser = {
		name,
		surname,
		facebookId: profile.id,
		username: email.split("@")[0],
		email,
		image: profile.photos[0].value,
	};

	return newUser;
};

module.exports = {
	generateUserFromFacebook,
	generateUserFromGoogle,
};
