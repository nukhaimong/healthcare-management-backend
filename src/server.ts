import { Server } from 'http';
import app from './app';
import { seedSuperAdmin } from './app/utils/seed';
import { envVars } from './config/env';
import { error } from 'console';

let server: Server;

const bootstrap = async () => {
  try {
    await seedSuperAdmin();
    server = app.listen(envVars.PORT, () => {
      console.log(`server is running on http://localhost/${envVars.PORT}`);
    });
  } catch (error) {
    console.log('Failed to start server', error);
  }
};

// SIGTERM signal handler
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Shutting down server...');

  if (server) {
    server.close(() => {
      console.log('server closed gracefully');
      process.exit(1);
    });
  }
  process.exit(1);
});

//SIGINT signal handler
process.on('SIGINT', () => {
  console.log('SIGINT signal recieved. Shutting down server...');

  if (server) {
    server.close(() => {
      console.log('server closed gracefully');
      process.exit(1);
    });
  }
  process.exit(1);
});

// uncaught exeption handler
process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception Detected... Shutting down server: ', error);
  if (server) {
    server.close(() => {
      console.log('server closed gracefully');
      process.exit(1);
    });
  }
  process.exit(1);
});

// unhandled rejection handler
process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection Detected... Shutting down server: ', error);

  if (server) {
    server.close(() => {
      console.log('server closed gracefully');
      process.exit(1);
    });
  }
  process.exit(1);
});

bootstrap();
