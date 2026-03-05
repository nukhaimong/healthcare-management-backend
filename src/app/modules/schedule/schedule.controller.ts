import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { ScheduleService } from './schedule.service';
import { sendResponse } from '../../shared/sendResponse';
import status from 'http-status';

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const schedule = ScheduleService.createSchedule(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Schedule created successfully',
    data: schedule,
  });
});

export const ScheduleController = {
  createSchedule,
};
