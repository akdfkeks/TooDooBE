"use strict";

import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
import Joi from "joi";
import { SignUp } from "../function/authService/authService.js";
import { logger } from "../function/logger/logger.js";

dotenv.config();

const signupSchema = Joi.object().keys({
	name: Joi.string().min(1).max(50),
	userId: Joi.string().min(1).max(20).required().alphanum(),
	userPw: Joi.string().min(1).max(40).required(),
});

export async function signUp(req, res, next) {
	const reqUser = {
		name: req.body.name,
		userId: req.body.userId,
		userPw: req.body.userPw,
	};
	//console.log(reqUser);

	const { error } = signupSchema.validate(reqUser, { abortEarly: true });
	if (!error) {
		try {
			const user = await SignUp(reqUser);
			res.status(201).json({ success: true, message: "SignUp Succeed" });
		} catch (err) {
			logger.error(err);
			res.status(500).json({ success: false, message: err.message });
		}
	} else {
		res.status(400).json({ success: false, message: "Invalid data format" });
	}
}

export async function login(req, res, next) {
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err || !user) {
			return res.status(401).json({ success: false, message: err || info.message });
		}
		req.login(user, { session: false }, (error) => {
			if (error) {
				return res.status(401).json({
					success: false,
					message: "Login Failed",
					//user: user,
				});
			}
			const resUser = {
				userName: user.name,
				userId: user.userId,
			};
			const token = jwt.sign(resUser, process.env.JWT_SECRET, {
				expiresIn: "1h",
				issuer: "TOODOO",
			});
			return (
				//res.cookie("token", token, { httpOnly: true, maxAge: 1000 * 60 * 120 }),
				res.status(200).json({ success: true, message: "Login Succeed", user: resUser, accessToken: token })
			);
		});
	})(req, res);
}
export function logout(req, res, next) {
	return res.cookie("token", null, { maxAge: 0 }), res.status(200).json({ success: true, message: "Logout Succeed" });
}
