import { UserRole } from '../../generated/prisma/enums';

export type AuthenticatedUser = {
  id: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
};
