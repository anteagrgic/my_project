import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { PropertyPilotValidationException } from './custom.exception';

const DEFAULT_MSG = 'Validation failed. Please try again.';

export const customValidationPipe = new ValidationPipe({
  stopAtFirstError: true,
  transform: true,
  exceptionFactory: (validationErrors: ValidationError[] = []): Error => {
    let msg: string | undefined;
    let errors = validationErrors;

    while (errors.length) {
      if ((errors[0].children?.length ?? 0) > 0) {
        errors = errors[0].children ?? [];
      }

      // If we are at the last level of the error tree, set the message
      else {
        msg = Object.values(errors[0].constraints ?? [])[0];
        break;
      }
    }

    return new PropertyPilotValidationException(msg ?? DEFAULT_MSG);
  },
});
