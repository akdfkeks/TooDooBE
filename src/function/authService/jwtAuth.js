import passport from "passport";

export function jwtAuth(req, res, next) {
	//console.log(req.cookies["token"]);
	if (!req.cookies["token"]) {
		return res.status(401).json({ success: false, message: "No permission!" });
	}

	return passport.authenticate("jwt", { session: false }, (err, jwtPayload) => {
		if (err || !jwtPayload) {
			return res.status(401).json({ success: false, message: "Fail to validate JWT" });
		}
		// set JWT's payload(data) to req.body Object
		// to enable the following middleware to know user information
		req.body.user = jwtPayload;
		next();
	})(req, res, next);
}