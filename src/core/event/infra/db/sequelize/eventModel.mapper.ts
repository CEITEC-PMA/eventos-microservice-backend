import { Event } from '@core/event/domain/eventEntity';
import { LoadEntityError } from '@core/shared/domain/validators/validation.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { EventModel } from './eventModel';

export class EventModelMapper {
  static toModel(entity: Event): EventModel {
    return EventModel.build({
      eventId: entity.eventId.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      createdAt: entity.createdAt,
    });
  }

  static toEntity(model: EventModel): Event {
    const event = new Event({
      eventId: new Uuid(model.eventId),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      createdAt: model.createdAt,
    });

    event.validate();
    if (event.notification.hasErrors()) {
      throw new LoadEntityError(event.notification.toJSON());
    }
    return event;
  }
}
