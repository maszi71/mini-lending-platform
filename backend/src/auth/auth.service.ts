import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '../generated/prisma/client';
import { UserRole } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthenticatedUser } from './types/authenticated-user.type';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  private readonly passwordSaltRounds = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const passwordHash = await bcrypt.hash(
      dto.password,
      this.passwordSaltRounds,
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
          email: dto.email.trim().toLowerCase(),
          phoneNumber: dto.phoneNumber.trim(),
          birthDate: new Date(dto.birthDate),
          passwordHash,
          // Public registration is intentionally restricted to customers; admins will be seeded later.
          role: UserRole.CUSTOMER,
        },
      });

      return this.createAuthResponse(user);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Email or phone number already exists.');
      }

      throw error;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const identifier = dto.identifier.trim().toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phoneNumber: dto.identifier.trim() }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.createAuthResponse(user);
  }

  async getMe(user: AuthenticatedUser): Promise<AuthUserDto> {
    const currentUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });

    return this.toAuthUser(currentUser);
  }

  private createAuthResponse(
    user: Prisma.UserGetPayload<object>,
  ): AuthResponseDto {
    const authUser = this.toAuthUser(user);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: authUser,
    };
  }

  private toAuthUser(user: Prisma.UserGetPayload<object>): AuthUserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }
}
