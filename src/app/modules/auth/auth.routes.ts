import { Router } from 'express';
import { AuthController } from './auth.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.get(
  '/me',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT),
  AuthController.getMe,
);
router.post('/register', AuthController.registerPatient);
router.post('/login', AuthController.loginUser);
router.post('/refresh-token', AuthController.getNewToken);
router.post(
  '/change-password',
  checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
  AuthController.changePassword,
);
router.post(
  '/logout',
  checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
  AuthController.logoutUser,
);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/forget-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/login/google', AuthController.googleLogin);
router.get('/google/success', AuthController.googleLoginSuccess);
router.get('/oauth/error', AuthController.handleOAuthError);

export const AuthRouter = router;
