import { Event } from '@core/event/domain/eventEntity';
import { IEventRepository } from '@core/event/domain/eventRepository';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { EventOutput, EventOutputMapper } from '../commom/eventOutput';

export class GetEventUseCase
  implements IUseCase<GetEventInput, GetEventOutput>
{
  constructor(private eventRepo: IEventRepository) {}

  async execute(input: GetEventInput): Promise<GetEventOutput> {
    const eventId = new Uuid(input.id);
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw new NotFoundError(input.id, Event);
    }

    return EventOutputMapper.toOutput(event);
  }
}

export type GetEventInput = {
  id: string;
};

export type GetEventOutput = EventOutput;
