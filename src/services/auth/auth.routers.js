const authRouter = require("express").Router();
const passport = require("passport");
const handleTokens = require("../../middlewares/handleTokens");
const { validateToken } = require("../../middlewares/validateToken");
const {
	refreshTokenHandler,
	logout,
	signup,
	login,
} = require("./auth.controllers");

authRouter.get("/refreshToken", refreshTokenHandler);
authRouter.get("/logout", validateToken, logout);
authRouter.post("/login", login);
authRouter.post("/signup", signup);
// GOOGLE
authRouter.get(
	"/facebookLogin",
	passport.authenticate("facebook", { scope: ["email"] })
);

authRouter.get(
	"/facebookRedirect",
	passport.authenticate("facebook"),
	handleTokens
);

module.exports = authRouter;
