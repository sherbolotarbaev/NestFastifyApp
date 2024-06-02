import { ConfigType, registerAs } from '@nestjs/config';

import { env, envNumber } from '~/global/env';

export const appRegToken = 'app';

export const AppConfig = registerAs(appRegToken, () => ({
  name: env('NAME'),
  port: envNumber('PORT', 3000),
  baseUrl: env('BASE_URL'),
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
