const { handleRefreshToken } = require("../../utils/auth/jwt");
const ApiError = require("../../utils/errors/ApiError");
const { UserModel } = require("../user");
const { generateTokens } = require("../../utils/auth/jwt");
exports.refreshTokenHandler = async (req, res, next) => {
	try {
		const oldRefreshToken = req.cookies.refreshToken;

		if (!oldRefreshToken)
			throw new ApiError(400, "Refresh token is missing");
		const newTokens = await handleRefreshToken(oldRefreshToken);

		res.cookie("token", newTokens.token);
		res.cookie("refreshToken", newTokens.refreshToken);
		res.send("OK");
	} catch (error) {
		console.log("Refresh token error", error);
		next(error);
	}
};

exports.logout = async (req, res, next) => {
	try {
		req.user.refreshTokens = [];
		await req.user.save();
		res.clearCookie("token");
		res.clearCookie("refreshToken");
		res.cookie("isAuthUser", false);
		// res.redirect(process.env.REDIRECT_LOGIN_URL);
		res.send("OK");
	} catch (error) {
		console.log("logout error: ", error);
		next(error);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await UserModel.findByCredentials(username, password);
		if (!user) return next(new ApiError(400, "Invalid Credentials"));
		const tokens = await generateTokens(user);
		res.cookie("token", tokens.token, { httpOnly: true });
		res.cookie("refreshToken", tokens.refreshToken, {
			httpOnly: true,
			path: "/api/users/refreshToken",
		});
		res.cookie("isAuthUser", true);
		res.status(200).send("Ok");
	} catch (error) {
		console.log("Login error: ", error);
		next(error);
	}
};

exports.signup = async (req, res, next) => {
	try {
		const { email, username } = req.body;
		const foundUserwithEmail = await UserModel.findOne({ email });
		const foundUserwithUsername = await UserModel.findOne({ username });
		if (foundUserwithUsername)
			throw new ApiError(400, "Username already exist!");
		if (foundUserwithEmail) throw new ApiError(400, "Email already exist!");
		const newUser = UserModel({ ...req.body });
		await newUser.save();

		res.status(200).send(newUser);
	} catch (error) {
		console.log("Signup error: ", error);
		next(error);
	}
};
