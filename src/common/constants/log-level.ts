import { AbstractConfigSetLevels } from 'winston/lib/winston/config';

export const LogLevel: AbstractConfigSetLevels = {
  error: 0,
  warning: 1,
  info: 2,
  debug: 3,
  verbose: 4,
};
