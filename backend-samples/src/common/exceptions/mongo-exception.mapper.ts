/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  PropertyPilotConflictException,
  PropertyPilotException,
  PropertyPilotInternalException,
} from './custom.exception';

// Error map based on error code
export const MONGO_ERROR_MAP = new Map<
  string | number,
  () => PropertyPilotException
>([
  [
    11000,
    (): PropertyPilotException =>
      new PropertyPilotConflictException('This record already exists.'),
  ],
  [
    112,
    (): PropertyPilotException =>
      new PropertyPilotConflictException(
        'Could not process the request, please try again.',
      ),
  ],
  [
    211,
    (): PropertyPilotException =>
      new PropertyPilotInternalException(
        'Something went wrong, please try again later.',
      ),
  ],
  [
    11600,
    (): PropertyPilotException =>
      new PropertyPilotInternalException(
        'Something went wrong, please try again later.',
      ),
  ],
]);
