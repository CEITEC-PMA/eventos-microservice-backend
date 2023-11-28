import { Event } from '@core/event/domain/eventEntity';
import { IEventRepository } from '@core/event/domain/eventRepository';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { EventOutput, EventOutputMapper } from '../commom/eventOutput';
import { CreateEventInput } from './createEventInput';

export class CreateEventUseCase
  implements IUseCase<CreateEventInput, CreateEventOutput>
{
  constructor(private readonly eventRepo: IEventRepository) {}

  async execute(input: CreateEventInput): Promise<CreateEventOutput> {
    const entity = Event.create(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.eventRepo.insert(entity);

    return EventOutputMapper.toOutput(entity);
  }
}

export type CreateEventOutput = EventOutput;
