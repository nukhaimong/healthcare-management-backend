import { Router } from 'express';
import { SpecialtyRoutes } from '../modules/specialty/specialty.routes';
import { AuthRouter } from '../modules/auth/auth.routes';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/specialties', SpecialtyRoutes);

export const indexRoutes = router;
