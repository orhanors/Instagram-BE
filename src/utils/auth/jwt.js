const jwt = require("jsonwebtoken");
const { UserModel } = require("../../services/user");
const { JWT_REFRESH_SECRET, JWT_SECRET } = process.env;
const ApiError = require("../errors/ApiError");

const generateTokens = async (user) => {
	try {
		const newAccessToken = await generateJWT({ _id: user._id });
		const newRefreshToken = await generateRefreshJWT({ _id: user._id });

		user.refreshTokens = user.refreshTokens.concat({
			token: newRefreshToken,
		});

		await user.save();

		return { token: newAccessToken, refreshToken: newRefreshToken };
	} catch (error) {
		console.log("JWT authenticate error: ", error);
		throw new Error(error);
	}
};

const handleRefreshToken = async (oldRefreshToken) => {
	//check if the old token is valid
	const decoded = await verifyRefreshToken(oldRefreshToken);

	//jwt.verify returns payload. We can check the user existince with _id
	const user = await UserModel.findOne({ _id: decoded._id });

	if (!user) throw new ApiError(403, "Access is forbidden");

	const currentRefreshToken = user.refreshTokens.find(
		(t) => t.token === oldRefreshToken
	);

	if (!currentRefreshToken)
		throw new ApiError(403, "Refresh token is missing or invalid");

	const newAccessToken = await generateJWT({ _id: user._id });
	const newRefreshToken = await generateRefreshJWT({ _id: user._id });

	user.refreshTokens.push({ token: newRefreshToken });
	await user.save();

	return { token: newAccessToken, refreshToken: newRefreshToken };
};

const generateJWT = (payload) =>
	new Promise((res, rej) => {
		jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" }, (err, token) => {
			if (err) rej(err);
			res(token);
		});
	});

const verifyJWT = (token) =>
	new Promise((res, rej) => {
		jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if (err) rej(err);
			res(decoded);
		});
	});

const generateRefreshJWT = (payload) =>
	new Promise((res, rej) =>
		jwt.sign(
			payload,
			JWT_REFRESH_SECRET,
			{ expiresIn: "1 week" },
			(err, token) => {
				if (err) rej(err);
				res(token);
			}
		)
	);

const verifyRefreshToken = (token) =>
	new Promise((res, rej) =>
		jwt.verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
			if (err) rej(err);
			res(decoded);
		})
	);

module.exports = { generateTokens, verifyJWT, handleRefreshToken };
