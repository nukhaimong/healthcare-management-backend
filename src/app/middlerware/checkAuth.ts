import { NextFunction, Request, Response } from 'express';
import { Role, UserStatus } from '../../generated/prisma/enums';
import { cookieUtils } from '../utils/cookies';
import AppError from '../errorHelpers/AppError';
import status from 'http-status';
import { prisma } from '../lib/prisma';
import { jwtUtils } from '../utils/jwt';
import { envVars } from '../../config/env';

export const checkAuth = (...authRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        'better-auth.session_token',
      );

      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          'Unauthorize access. No token access provided',
        );
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });
        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);
          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemainig = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemainig < 20) {
            res.setHeader('X-Session-Refresh', 'true');
            res.setHeader('X-Session-Expires-At', expiresAt.toString());
            res.setHeader('X-Time-Remaining', timeRemaining.toString());

            console.log('Session Expiring Soon');
          }
          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              'Unauthorize access. User is not active',
            );
          }
          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              'Unauthorize access. User is not deleted',
            );
          }
          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              'Forbidden access. You do not have permission to access this resource',
            );
          }
        }
      }
      const accessToken = cookieUtils.getCookie(req, 'ACCESS_TOKEN');

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          'Unauthorize access. No access token provided',
        );
      }

      const veryfiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );

      if (!veryfiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          'Unauthorized access. Invalid token',
        );
      }

      if (
        authRoles.length > 0 &&
        !authRoles.includes(veryfiedToken.data!.role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          'Forbidden access. you have no permission to access this recource',
        );
      }
      next();
    } catch (error: any) {
      next(error);
    }
  };
};
