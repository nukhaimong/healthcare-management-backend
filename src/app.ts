import express, { Application, Request, Response } from 'express';
import { indexRoutes } from './app/router';
import { globalErrorHandler } from './app/middlerware/globalErrorhandler';
import { notFound } from './app/middlerware/notFound';
import AppError from './app/errorHelpers/AppError';
import status from 'http-status';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/', indexRoutes);

app.get('/', (req: Request, res: Response) => {
  throw new AppError(status.BAD_REQUEST, 'testing custom error handler');
  res.send('Hello World with TypeScript and Express!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
