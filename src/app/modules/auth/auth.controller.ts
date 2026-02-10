import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { AuthService } from './auth.service';
import { sendResponse } from '../../shared/sendResponse';
import { tokenUtils } from '../../utils/token';

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.registerPatient(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionToken(res, token as string);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Patient registerd successfully',
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest,
    },
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.loginUser(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionToken(res, token);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'User Login Successfully',
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

export const AuthController = {
  registerPatient,
  loginUser,
};
