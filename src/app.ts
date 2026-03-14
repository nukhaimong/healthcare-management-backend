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
import { PaymentController } from './app/modules/payment/payment.controller';
const app: Application = express();
import cron from 'node-cron';
import { AppointmentService } from './app/modules/appointments/appointment.service';

app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), `src/app/templates`));

app.use('/api/auth', toNodeHandler(auth));

app.set('query parser', (str: string) => qs.parse(str));

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  PaymentController.handleStripeWebhookEvent,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule('*/25 * * * *', async () => {
  try {
    console.log('Executing cancel appointments by node-cron');
    await AppointmentService.cancelUnpaidAppointments();
  } catch (error) {
    console.error('Error occurred while cancelling unpaid appointments');
  }
});

app.use(cookieParser());

app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
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

app.use(globalErrorHandler);
app.use(notFound);

export default app;
