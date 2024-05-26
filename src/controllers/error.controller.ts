import { Request, Response, NextFunction } from "express";


const sendErrorDev = (err: any, res: Response) => {
	res.status(err.statusCode).json({
		status: "failure",
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err: any, res: Response) => {
	// Errors created by me
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: "failure",
			message: err.message,
		});
	}
	//Programming or unknown error
	else {
		console.error("ERROR!💥💥💥", err);
		res.status(500).json({
			status: "failure",
			message: "Something went wrong :(",
		});
	}
};

export function errorController (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";
	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else {
		sendErrorProd(err, res);
	}
}