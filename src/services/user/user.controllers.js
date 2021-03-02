const { UserModel } = require("./user.schema");

exports.getUserProfile = async (req, res, next) => {
	try {
		res.status(200).send(req.user);
	} catch (error) {
		console.log("user get profile error: ", error);
		next(error);
	}
};
