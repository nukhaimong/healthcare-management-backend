import { z } from 'zod';
import { Gender } from '../../../generated/prisma/enums';

export const createDoctorSchema = z.object({
  password: z
    .string('password is required and must be string')
    .min(8, 'Password must be at least 8 characters'),

  doctor: z.object({
    name: z
      .string('name is required and must be string')
      .min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    contactNumber: z
      .string('contact number is required and must be string')
      .min(10, 'Contact number is required and must be at least 10 digits')
      .optional(),
    address: z.string('address must be string').optional(),
    registrationNumber: z
      .string('registration number is required and must be string')
      .min(1, 'Registration number is required'),
    experience: z
      .number('experience must be string')
      .int()
      .nonnegative()
      .optional(),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE],
      'Gender must be Male or Female',
    ),
    appointmentFee: z
      .number('appointment fee is required and must be a number')
      .nonnegative('Exprerience cannot be negative'),
    qualification: z
      .string('qualification is required and must be string')
      .min(1, 'qualification is required'),
    currentWorkingPlace: z
      .string('current working place is required and must be string')
      .min(1, 'current working place is required'),
    designation: z
      .string('designation is required and must be string')
      .min(1, 'designation is required'),
  }),

  specialties: z
    .array(z.uuid('Invalid specialty ID'))
    .min(1, 'At least one specialty is required'),
});
