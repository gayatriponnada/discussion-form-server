import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function hashPassword (
	password: string,
	salt: number = 12
) {
	return await bcrypt.hash(password, salt);
}

async function validPassword (
	currentPassword: string,
	password: string
) {
	return await bcrypt.compare(currentPassword, password);
}

function signToken (payload: {
	id: number;
	email: string;
	name: string;
	role: string;
}) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			process.env.JWT_KEY || "",
			{
				expiresIn: "1d"
			},
			(err, token) => {
				if (err) return reject(err);
				return resolve(token);
			}
		);
	});
}

function verifyToken (token: string) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_KEY || "", (err: unknown, token) => {
			if (err) return reject(err);
			return resolve(token);
		});
	});
}

export default {
	validPassword,
	hashPassword,
	signToken,
	verifyToken
};