import { Router } from 'express';
import { SpecialtyRoutes } from '../modules/specialty/specialty.routes';
import { AuthRouter } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { DoctorRoutes } from '../modules/doctor/doctor.routes';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/specialties', SpecialtyRoutes);
router.use('/users', UserRoutes);
router.use('/doctors', DoctorRoutes);

export const indexRoutes = router;
