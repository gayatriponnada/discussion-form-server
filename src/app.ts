import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Request, Response, NextFunction } from 'express';
import AppError from "@server/utils/error.util";
import { errorController } from "@server/controllers/error.controller";
import AuthRouter from '@server/routes/auth.route';

export const createApp = () => {

  const app = express();

  app
    .use(morgan("dev"))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static("public"))
    .use(
      cors({
        origin: "*",
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Allow credentials (cookies, authorization headers,
      })
    );

  // Routes
  app.use('/auth', AuthRouter);

  app.use("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`can't find the ${req.originalUrl} on this server`, 404));
  });

  app.use(errorController);


  return app;
};
