import express, { Application, Request, Response } from 'express';
import { indexRoutes } from './app/router';
import { globalErrorHandler } from './app/middleware/globalErrorhandler';
import { notFound } from './app/middleware/notFound';
import AppError from './app/errorHelpers/AppError';
import status from 'http-status';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';
import path from 'path';
import cors from 'cors';
import { envVars } from './config/env';
import qs from 'qs';
const app: Application = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), `src/app/templates`));

app.use('/api/auth', toNodeHandler(auth));

app.set('query parser', (str: string) => qs.parse(str));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: [
      envVars.FORNTEND_URL,
      envVars.BETTER_AUTH_URL,
      'http://localhost:3000',
      'http://localhost:5000',
    ],
    credentials: true,
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use('/api/v1/', indexRoutes);

app.get('/', (req: Request, res: Response) => {
  throw new AppError(status.BAD_REQUEST, 'testing custom error handler');
  res.send('Hello World with TypeScript and Express!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
