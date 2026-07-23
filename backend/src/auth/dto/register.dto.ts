import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Masoud' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Varzi' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'masoud@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '09123456789',
    description:
      'Local or international phone number. OTP verification is Phase 2.',
  })
  @Matches(/^\+?[0-9]{8,15}$/, {
    message: 'phoneNumber must contain 8 to 15 digits and may start with +',
  })
  phoneNumber: string;

  @ApiProperty({ example: '1995-01-01' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MinLength(8)
  password: string;
}
