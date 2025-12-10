/**
 * Custom exception classes for project-specific exceptions.
 * TODO Replace the "PropertyPilot" with your project's name.
 */

import { ExceptionName } from './custom.exception.enum';
import { ICustomExceptionInfo } from './exception-info.interface';
import { getException } from './metadata.exception';

export abstract class PropertyPilotException extends Error {
  public exceptionName: ExceptionName;
  public exceptionInfo: ICustomExceptionInfo;

  constructor(exceptionName: ExceptionName, message: string) {
    super();
    this.exceptionName = exceptionName;
    this.exceptionInfo = getException(exceptionName);
    this.exceptionInfo.detail = message;
  }

  public toString = (): string => {
    return `${this.exceptionName} exception:\n${this.exceptionInfo}`;
  };
}

export class PropertyPilotNotFoundException extends PropertyPilotException {
  constructor(message: string) {
    super(ExceptionName.NOT_FOUND, message);
  }
}

export class PropertyPilotConflictException extends PropertyPilotException {
  constructor(message: string) {
    super(ExceptionName.CONFLICT, message);
  }
}

export class PropertyPilotForbiddenException extends PropertyPilotException {
  constructor(message: string) {
    super(ExceptionName.FORBIDDEN, message);
  }
}

export class PropertyPilotValidationException extends PropertyPilotException {
  constructor(message: string) {
    super(ExceptionName.VALIDATION_FAILED, message);
  }
}

export class PropertyPilotInternalException extends PropertyPilotException {
  constructor(message: string) {
    super(ExceptionName.INTERNAL_EXCEPTION, message);
  }
}

export class PropertyPilotExternalServiceException extends PropertyPilotException {
  constructor(message: string) {
    super(ExceptionName.EXTERNAL_SERVICE_EXCEPTION, message);
  }
}

export class PropertyPilotUnauthorizedException extends PropertyPilotException {
  constructor(message: string) {
    super(ExceptionName.INCORRECT_SIGNIN, message);
  }
}

// TODO Add exception classes when needed.
