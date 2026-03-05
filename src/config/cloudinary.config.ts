import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { envVars } from './env';
import AppError from '../app/errorHelpers/AppError';
import status from 'http-status';
import { file } from 'zod';
import { error } from 'node:console';

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.COUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_CLOUD_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_CLOUD_API_SECRET,
});

export const uploadFileCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  if (buffer || fileName) {
    throw new AppError(
      status.BAD_REQUEST,
      'File buffer and filename are required to upload',
    );
  }

  const extension = fileName.split('.').pop()?.toLowerCase();

  const fileNameWithoutExtension = fileName
    .split('.')
    .slice(0, -1)
    .join('.')
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9\-]/g, '');

  const uniqueName =
    Math.random().toString(36).substring(2) +
    '-' +
    Date.now() +
    '-' +
    fileNameWithoutExtension;
  const folder = extension === 'pdf' ? 'pdf' : 'images';

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'auto',
          public_id: uniqueName,
          folder: `healthcare/${folder}`,
        },
        (error, result) => {
          if (error) {
            return reject(
              new AppError(
                status.INTERNAL_SERVER_ERROR,
                'failed to upload image',
              ),
            );
          }
          resolve(result as UploadApiResponse);
        },
      )
      .end(buffer);
  });
};

export const deleteFIleFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;

    const match = url.match(regex);

    if (match && match[1]) {
      const publicId = match[1];

      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error('Error deleting file from cloudinary: ', Error);
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to delete image from cloudinary',
    );
  }
};

export const cloudinaryUpload = cloudinary;
