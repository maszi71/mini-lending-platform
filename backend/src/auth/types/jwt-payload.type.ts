import { UserRole } from '../../generated/prisma/enums';

export type JwtPayload = {
  sub: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
};
