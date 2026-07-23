import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/enums';

export class AuthUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Masoud' })
  firstName: string;

  @ApiProperty({ example: 'Varzi' })
  lastName: string;

  @ApiProperty({ example: 'masoud@example.com' })
  email: string;

  @ApiProperty({ example: '09123456789' })
  phoneNumber: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  role: UserRole;
}
