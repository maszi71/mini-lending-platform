type RawEnv = Record<string, string | undefined>;

export type AppEnv = {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
};

export function validateEnv(config: RawEnv): AppEnv {
  const port = Number(config.PORT ?? 3000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer.');
  }

  for (const key of ['DATABASE_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN'] as const) {
    if (!config[key]) {
      throw new Error(`${key} is required.`);
    }
  }

  const databaseUrl = config.DATABASE_URL;
  const jwtSecret = config.JWT_SECRET;
  const jwtExpiresIn = config.JWT_EXPIRES_IN;

  if (!databaseUrl || !jwtSecret || !jwtExpiresIn) {
    throw new Error('Required environment values are missing.');
  }

  // Returning normalized values keeps ConfigService consumers simple and consistent.
  return {
    PORT: port,
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: jwtExpiresIn,
  };
}
