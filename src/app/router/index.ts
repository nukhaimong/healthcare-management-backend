import { Router } from 'express';
import { SpecialtyRoutes } from '../modules/specialty/specialty.routes';
import { AuthRouter } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { DoctorRoutes } from '../modules/doctor/doctor.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { ScheduleRoutes } from '../modules/schedule/schedule.routes';
import { DoctorScheduleRoutes } from '../modules/doctorSchedules/doctorSchedules.routes';
import { AppointmentRoutes } from '../modules/appointments/appointment.routes';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/specialties', SpecialtyRoutes);
router.use('/users', UserRoutes);
router.use('/doctors', DoctorRoutes);
router.use('/admins', AdminRoutes);
router.use('/schedule', ScheduleRoutes);
router.use('/doctor-schedule', DoctorScheduleRoutes);
router.use('/appointment', AppointmentRoutes);

export const indexRoutes = router;
