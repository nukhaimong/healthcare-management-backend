import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { DoctorService } from './doctor.service';
import { Result } from 'pg';
import { sendResponse } from '../../shared/sendResponse';
import status from 'http-status';

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getAllDoctors();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'All Doctors Fetched Successfully',
    data: result,
  });
});

export const DoctorController = {
  getAllDoctors,
};
