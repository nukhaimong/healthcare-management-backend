import express, { Application, Request, Response } from 'express';
import { indexRoutes } from './app/router';

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/api/v1/', indexRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World with TypeScript and Express!');
});

export default app;
