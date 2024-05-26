import catchAsync from "@server/utils/api.util";

export const login = catchAsync(async function (req, res, next) {
	console.log(req.body);
	return res.status(200).json({
		message: 'Logged in successfully',
		data: req.body,
	});
});