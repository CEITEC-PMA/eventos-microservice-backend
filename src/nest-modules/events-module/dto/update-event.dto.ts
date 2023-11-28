import { UpdateEventInput } from '@core/event/application/updateEvent/updateEventInput';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateEventInputWithoutId extends OmitType(UpdateEventInput, [
  'id',
] as const) {}

export class UpdateEventDto extends UpdateEventInputWithoutId {}
