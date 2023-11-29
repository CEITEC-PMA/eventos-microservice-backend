import { Event } from '@core/event/domain/eventEntity';
import { IEventRepository } from '@core/event/domain/eventRepository';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { EventOutput, EventOutputMapper } from '../commom/eventOutput';
import { UpdateEventInput } from './updateEvent.input';

export class UpdateEventUseCase
  implements IUseCase<UpdateEventInput, UpdateEventOutput>
{
  constructor(private eventRepo: IEventRepository) {}

  async execute(input: UpdateEventInput): Promise<UpdateEventOutput> {
    const eventId = new Uuid(input.id);
    const event = await this.eventRepo.findById(eventId);

    if (!event) {
      throw new NotFoundError(input.id, Event);
    }

    input.name && event.changeName(input.name);

    if (input.description !== undefined) {
      event.changeDescription(input.description);
    }

    if (input.is_active === true) {
      event.activate();
    }

    if (input.is_active === false) {
      event.deactivate();
    }

    if (event.notification.hasErrors()) {
      throw new EntityValidationError(event.notification.toJSON());
    }

    await this.eventRepo.update(event);

    return EventOutputMapper.toOutput(event);
  }
}

export type UpdateEventOutput = EventOutput;
