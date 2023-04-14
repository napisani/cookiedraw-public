import {LoggerConfig} from '../app/shared/log/logger-config';

export const environment = {
  production: true,
  loggerConfig: {
    root: {
      enableDebug: true,
      enableWarn: true,
      enableError: true,
      enableInfo: true,
      enableTrace: true
    },
    specific: {}
  } as LoggerConfig,
  apiUrl: 'https://cookiedraw.com',
  jwtPreAuth: {
    enabled: false,
    jwt: ''
  },
};
