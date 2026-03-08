import { addHours, addMinutes, format } from 'date-fns';
import {
  ICreateSchedulePayload,
  IUpdateSchedulePayload,
} from './schedule.inteface';
import { convertDateTime } from './schedule.util';
import { prisma } from '../../lib/prisma';
import { IQueryParams } from '../../interfaces/query.interface';
import { QueryBuilder } from '../../utils/QueryBuilders';
import { Prisma, Schedule } from '../../../generated/prisma/client';
import {
  scheduleFilerableFields,
  scheduleIncludeConfig,
  scheduleSearchableFields,
} from './schedule.constants';

const createSchedule = async (payload: ICreateSchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const interval = 30;
  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, 'yyyy-MM-dd')}`,
          Number(startTime.split(':')[0]),
        ),
        Number(startTime.split(':')[1]),
      ),
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, 'yyyy-MM-dd')}`,
          Number(endTime.split(':')[0]),
        ),
        Number(endTime.split(':')[1]),
      ),
    );
    while (startDateTime < endDateTime) {
      const s = await convertDateTime(startDateTime);
      const e = await convertDateTime(addMinutes(startDateTime, interval));

      const scheduleData = {
        startDateTime: s,
        endDateTime: e,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });
      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + interval);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getAllSchedules = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Schedule,
    Prisma.ScheduleWhereInput,
    Prisma.ScheduleInclude
  >(prisma.schedule, query, {
    searchableFields: scheduleSearchableFields,
    filterableFields: scheduleFilerableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .dynamicInclude(scheduleIncludeConfig)
    .sort()
    .fields()
    .execute();

  return result;
};

const getScheduleById = async (id: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
  });
  return schedule;
};

const updateSchedule = async (id: string, payload: IUpdateSchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const startDateTime = new Date(
    addMinutes(
      addHours(
        `${format(new Date(startDate), 'yyyy-MM-dd')}`,
        Number(startTime.split(':')[0]),
      ),
      Number(startTime.split(':')[1]),
    ),
  );
  const endDateTime = new Date(
    addMinutes(
      addHours(
        `${format(new Date(endDate), 'yyyy-MM-dd')}`,
        Number(endTime.split(':')[0]),
      ),
      Number(endTime.split(':')[1]),
    ),
  );

  const updateSchedule = await prisma.schedule.update({
    where: { id },
    data: {
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    },
  });
  return updateSchedule;
};

const deleteSchedule = async (id: string) => {
  const schedule = await prisma.schedule.delete({
    where: { id },
  });
  return schedule;
};

export const ScheduleService = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
