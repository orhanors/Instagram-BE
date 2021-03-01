const { verifyJWT } = require("../utils/auth/jwt");
const ApiError = require("../utils/errors/ApiError");
const { UserModel } = require("../services/user");
const validateToken = async (req, res, next) => {
	try {
		let token = req.cookies.token;

		if (!token) {
			token = req.header("Authorization").replace("Bearer ", "");
		}
		console.log("token: ", token);
		const decoded = await verifyJWT(token);
		console.log("decoded: ", decoded);
		const user = await UserModel.findOne({
			_id: decoded._id,
		});

		if (!user) {
			throw new ApiError(401, "Unauthorized");
		}

		req.token = token;
		req.user = user;
		next();
	} catch (e) {
		next(e);
	}
};

module.exports = { validateToken };
