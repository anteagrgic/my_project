import { IsNotEmpty, IsUUID } from 'class-validator';

export class UUIDParam {
  @IsNotEmpty({ message: 'Id should be provided' })
  @IsUUID(undefined, { message: 'Id should be a valid UUID' })
  id: string;
}
