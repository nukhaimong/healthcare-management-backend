import { DoctorSchedules, Prisma } from '../../../generated/prisma/client';
import { IQueryParams } from '../../interfaces/query.interface';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilders';
import {
  doctorScheduleFilterableFields,
  doctorScheduleIncludeConfig,
  doctorScheduleSeachableFields,
} from './doctorSchedule.constant';
import {
  ICreateDoctorSchedulePayload,
  IUpdateDoctorSchedulePayload,
} from './doctorSchedule.interface';

const createMyDoctorSchedule = async (
  user: IRequestUser,
  paylaod: ICreateDoctorSchedulePayload,
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorScheduleData = paylaod.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  const result = await prisma.doctorSchedules.findMany({
    where: {
      doctorId: doctorData.id,
      scheduleId: {
        in: paylaod.scheduleIds,
      },
    },
    include: {
      schedule: true,
    },
  });

  return result;
};

const getMyDoctorSchedules = async (
  user: IRequestUser,
  query: IQueryParams,
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const queryBuilder = new QueryBuilder<
    DoctorSchedules,
    Prisma.DoctorSchedulesWhereInput,
    Prisma.DoctorSchedulesInclude
  >(
    prisma.doctorSchedules,
    { doctorId: doctorData.id, ...query },
    {
      searchableFields: doctorScheduleSeachableFields,
      filterableFields: doctorScheduleFilterableFields,
    },
  );

  const doctorSchedules = await queryBuilder
    .search()
    .filter()
    .paginate()
    .include({
      schedule: true,
      doctor: {
        include: {
          user: true,
        },
      },
    })
    .dynamicInclude(doctorScheduleIncludeConfig)
    .sort()
    .fields()
    .execute();
  return doctorSchedules;
};

const getAllDoctorSchedules = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    DoctorSchedules,
    Prisma.DoctorSchedulesWhereInput,
    Prisma.DoctorSchedulesInclude
  >(prisma.doctorSchedules, query, {
    searchableFields: doctorScheduleSeachableFields,
    filterableFields: doctorScheduleFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .dynamicInclude(doctorScheduleIncludeConfig)
    .sort()
    .execute();
  return result;
};

const getDoctorScheduleById = async (doctorId: string, scheduleId: string) => {
  const doctorSchedule = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorId,
        scheduleId: scheduleId,
      },
    },
  });
  return doctorSchedule;
};

const updateMyDoctorSchedule = async (
  user: IRequestUser,
  payload: IUpdateDoctorSchedulePayload,
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const deleteIds = payload.scheduleIds
    .filter((schedule) => schedule.shouldDelete)
    .map((schedule) => schedule.id);
  const createIds = payload.scheduleIds
    .filter((schedule) => !schedule.shouldDelete)
    .map((schedule) => schedule.id);

  const result = await prisma.$transaction(async (tx) => {
    await tx.doctorSchedules.deleteMany({
      where: {
        isBooked: false,
        doctorId: doctorData.id,
        scheduleId: {
          in: deleteIds,
        },
      },
    });
    const doctorScheduleData = createIds.map((scheduleId) => ({
      doctorId: doctorData.id,
      scheduleId,
    }));

    const result = await tx.doctorSchedules.createMany({
      data: doctorScheduleData,
    });
    return result;
  });
  return result;
};

const deleteMyDoctorSchedule = async (id: string, user: IRequestUser) => {
  const doctoData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  await prisma.doctorSchedules.deleteMany({
    where: {
      isBooked: false,
      doctorId: doctoData.id,
      scheduleId: id,
    },
  });
};

export const DoctorScheduleService = {
  createMyDoctorSchedule,
  updateMyDoctorSchedule,
  getMyDoctorSchedules,
  getAllDoctorSchedules,
  getDoctorScheduleById,
  deleteMyDoctorSchedule,
};
