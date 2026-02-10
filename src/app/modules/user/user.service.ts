import status from 'http-status';
import { Role, Specialty } from '../../../generated/prisma/client';
import AppError from '../../errorHelpers/AppError';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { ICreateDoctorPayload } from './user.interface';

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialties: Specialty[] = [];

  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });
    if (!specialty) {
      //throw new Error(`specialty with id ${specialtyId} not found`);
      throw new AppError(
        status.CONFLICT,
        `specialty with id ${specialtyId} not found`,
      );
    }
    specialties.push(specialty);
  }

  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });
  if (userExist) {
    //throw new Error('User with this email already exists');
    throw new AppError(
      status.BAD_REQUEST,
      'User with this email already exists',
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      name: payload.doctor.name,
      role: Role.DOCTOR,
      needPasswordChange: true,
      password: payload.password,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          ...payload.doctor,
          userId: userData.user.id,
        },
      });
      const doctorSpecialtyData = specialties.map((specialty) => {
        return {
          doctorId: doctorData.id,
          specialtyId: specialty.id,
        };
      });
      await tx.doctorSpeciality.createMany({
        data: doctorSpecialtyData,
      });
      const doctor = await tx.doctor.findUnique({
        where: { id: doctorData.id },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          registrationNumber: true,
          contactNumber: true,
          address: true,
          experience: true,
          appointmentFee: true,
          qualification: true,
          designation: true,
          currentWorkingPlace: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  title: true,
                  id: true,
                },
              },
            },
          },
        },
      });
      return doctor;
    });
    return result;
  } catch (error) {
    console.log('Transaction error: ', error);
    await prisma.user.delete({
      where: { id: userData.user.id },
    });
    throw error;
  }
};

export const UserService = {
  createDoctor,
};
