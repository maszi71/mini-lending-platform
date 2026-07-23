import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';
import { UserRole } from '../src/generated/prisma/enums';

type AdminSeedConfig = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  password: string;
};

const passwordSaltRounds = 12;

function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is required for database seeding.`);
  }

  return value;
}

function getAdminSeedConfig(): AdminSeedConfig {
  return {
    firstName: getRequiredEnv('SEED_ADMIN_FIRST_NAME'),
    lastName: getRequiredEnv('SEED_ADMIN_LAST_NAME'),
    email: getRequiredEnv('SEED_ADMIN_EMAIL').toLowerCase(),
    phoneNumber: getRequiredEnv('SEED_ADMIN_PHONE_NUMBER'),
    birthDate: new Date(getRequiredEnv('SEED_ADMIN_BIRTH_DATE')),
    password: getRequiredEnv('SEED_ADMIN_PASSWORD'),
  };
}

async function main(): Promise<void> {
  const connectionString = getRequiredEnv('DATABASE_URL');
  const admin = getAdminSeedConfig();
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [{ email: admin.email }, { phoneNumber: admin.phoneNumber }],
      },
    });

    if (existingAdmin) {
      console.log(
        `Admin seed skipped. User already exists: ${existingAdmin.email}`,
      );
      return;
    }

    const passwordHash = await bcrypt.hash(admin.password, passwordSaltRounds);

    const createdAdmin = await prisma.user.create({
      data: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        birthDate: admin.birthDate,
        passwordHash,
        // Public registration creates customers only; this controlled seed bootstraps the first admin.
        role: UserRole.ADMIN,
      },
    });

    console.log(`Admin seed created: ${createdAdmin.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
