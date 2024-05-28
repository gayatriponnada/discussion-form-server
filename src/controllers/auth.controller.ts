import prisma from "@server/db";
import catchAsync from "@server/utils/api.util";
import AppError from "@server/utils/error.util";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";

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
			password: hashSync(password, 5)
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
	if (!compareSync(password, user.password)) {
		throw new AppError("Incorrect password", 400);
	}

	res.status(201).json({
		status: 'success',
		message: "Logged in successfully",
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

	if (!user || !compareSync(password, user.password)) {
		throw new AppError("Password is not matching or user does not exists", 400);
	}
	const hashedPassword = hashSync(newPassword, 12);

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

