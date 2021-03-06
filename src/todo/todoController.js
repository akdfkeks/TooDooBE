"use strict";

import { getTodo, createTodo, deleteTodo } from "../function/todoService/todoService.js";
import { getYearMonth } from "../function/etc/date.js";
import { logger } from "../function/logger/logger.js";
import Joi from "joi";

const getTodoSchema = Joi.object().keys({
	userId: Joi.string().min(1).max(20).required().alphanum(),
	targetYearMonth: Joi.string()
		.length(6)
		.pattern(new RegExp(/^\d{4}(0[1-9]|1[012])$/)),
});
const createTodoSchema = Joi.object().keys({
	userId: Joi.string().min(1).max(20).required().alphanum(),
	title: Joi.string().min(1).max(100),
	targetDate: Joi.string().pattern(
		new RegExp(/^\d{4}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])-(0[0-9]|1[0-9]|2[0-4])(0[0-9]|[1-5][0-9])$/)
	),
});
const deleteTodoSchema = Joi.object().keys({
	//02ffd70e-d524-4ec3-ba5f-95cc1d1b2bc5
	uuid: Joi.string().uuid().required(),
});

export async function getToodoo(req, res, next) {
	// user object from jwtAuth Middleware
	const { userId } = req.body.user;
	let { targetYearMonth } = req.body;
	const { error } = getTodoSchema.validate({ userId, targetYearMonth }, { abortEarly: true });
	if (typeof targetYearMonth !== "number") targetYearMonth = parseInt(targetYearMonth);

	if (!error) {
		try {
			const data = await getTodo(userId, targetYearMonth);
			return res.status(200).json({ success: true, message: "Success!", data: data });
		} catch (err) {
			logger.error(err);
			return res.status(500).json({ success: false, message: err.message });
		}
	} else {
		return res.status(400).json({ success: false, message: "Invalid data format" });
	}
}

export async function createToodoo(req, res, next) {
	const { userId } = req.body.user;
	const { title, targetDate } = req.body;

	const { error } = createTodoSchema.validate({ userId, title, targetDate }, { abortEarly: true });

	if (!error) {
		try {
			const data = await createTodo(userId, title, targetDate);
			res.status(200).json({ success: true, message: "Success!", data: data });
		} catch (err) {
			logger.error(err);
			res.status(500).json({ success: false, message: err.message });
		}
	} else {
		return res.status(400).json({ success: false, message: "Invalid data format" });
	}
}

export function modifyToodoo(req, res, next) {
	//
}

export async function deleteToodoo(req, res, next) {
	const scheduleUuid = req.body.uuid;
	const { error } = deleteTodoSchema.validate({ uuid: scheduleUuid });

	if (!error) {
		try {
			const data = await deleteTodo(scheduleUuid);
			res.status(200).json({ success: true, message: "Success!", data: data });
		} catch (err) {
			console.log(err);
			return res.status(400).json({ success: false, message: "Invalid data format" });
		}
	}
}
