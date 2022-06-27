export const exceptCtrl = (req, res, next) => {
	res.status(404).json({ success: false, message: "API not supported" });
};

export const rootCtrl = (req, res, next) => {
	res.status(200).json({ success: true, message: "Hi" });
};