import { Role, UserStatus } from '../../../generated/prisma/enums';

export interface IUpdateAdminPayload {
  admin?: {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
  };
}

export interface IUpdateUserStatus {
  userId: string;
  userStatus: UserStatus;
}

export interface IUpdateUserRole {
  userId: string;
  role: Role;
}
