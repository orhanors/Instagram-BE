const { verifyJWT } = require("../utils/auth/jwt");
const ApiError = require("../utils/errors/ApiError");
const { UserModel } = require("../services/user");
const validateToken = async (req, res, next) => {
	try {
		const token = req.cookies.token;

		const decoded = await verifyJWT(token);
		const user = await UserModel.findOne({
			_id: decoded._id,
		});

		if (!user) {
			throw new ApiError(401, "Unauthorized");
		}

		req.token = token;
		req.user = user;
		console.log(req.token)
		next();
	} catch (e) {
		next(new ApiError(401, "Unauthorized"));
	}
};

module.exports = { validateToken };
