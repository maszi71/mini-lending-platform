import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'masoud@example.com',
    description: 'Email or phone number.',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MinLength(8)
  password: string;
}
