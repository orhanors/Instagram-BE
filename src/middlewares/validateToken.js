const { verifyJWT } = require("../utils/auth/jwt");
const ApiError = require("../utils/errors/ApiError");
const { UserModel } = require("../services/user");
const validateToken = async (req, res, next) => {
	try {
		let token = req.cookies.token;

		if (!token) {
			token = req.header("Authorization").replace("Bearer ", "");
			if (!token) throw new ApiError(401);
		}

		const decoded = await verifyJWT(token);

		const user = await UserModel.findOne({
			_id: decoded._id,
		});

		if (!user) {
			throw new ApiError(401, "Unauthorized");
		}

		req.token = token;
		req.user = user;
		console.log(req.token);
		next();
	} catch (e) {
		next(e);
	}
};

module.exports = { validateToken };
