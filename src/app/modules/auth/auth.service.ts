import { User, UserStatus } from '../../../generated/prisma/client';
import { auth } from '../../lib/auth';

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}
interface ILoginPayload {
  email: string;
  password: string;
}
const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
  if (!data.user) {
    throw new Error('Failed to register patient');
  }
  //todo: create patient profile after sign up user as patient

  return data;
};

const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new Error('User Is Blocked');
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new Error('User Is Deleted');
  }
  return data;
};

export const AuthService = {
  registerPatient,
  loginUser,
};
