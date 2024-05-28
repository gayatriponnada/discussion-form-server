import prisma from "@server/db";
import catchAsync from "@server/utils/api.util";
import AppError from "@server/utils/error.util";
import Auth from "@server/utils/auth.util";

export const signUp = catchAsync(async function (req, res, next) {
	const { name, email, password, confirmPassword } = req.body;
	if (password !== confirmPassword) {
		throw new AppError("Passwords are not same", 400);
	}
	let user = await prisma.user.findFirst({
		where: {
			email
		}
	});
	if (user) {
		throw new AppError("User already exist", 400);
	}
	user = await prisma.user.create({
		data: {
			name,
			email,
			password: await Auth.hashPassword(password)
		}
	});
	res.status(201).json({
		message: "User created successfully",
		data: user
	});
});

export const login = catchAsync(async function (req, res, next) {
	const { email, password } = req.body;

	let user = await prisma.user.findFirst({
		where: {
			email
		}
	});
	if (!user) {
		throw new AppError("User does not exist", 400);
	}
	if (!(await Auth.validPassword(password, user.password))) {
		throw new AppError("Incorrect password", 400);
	}
	const token = await Auth.signToken({
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role
	});
	res.status(200).json({
		status: 'success',
		message: "Logged in successfully",
		data: {
			token, user
		}
	});
});

export const resetPassword = catchAsync(async function (req, res, next) {
	const { password, newPassword, confirmPassword, email } = req.body;
	if (newPassword !== confirmPassword) {
		throw new AppError("Passwords are not same", 400);
	}
	let user = await prisma.user.findFirst({
		where: {
			email
		}
	});

	if (!user || !(await Auth.validPassword(password, user.password))) {
		throw new AppError("Password is not matching or user does not exists", 400);
	}
	const hashedPassword = await Auth.hashPassword(newPassword);

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			password: hashedPassword
		}
	});
	res.status(201).json({
		status: 'success',
		message: 'Password has been reset successfully'
	});


})

