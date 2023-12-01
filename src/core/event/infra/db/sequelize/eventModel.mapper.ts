import { Event, EventId } from '@core/event/domain/eventEntity.aggregate';
import { LoadEntityError } from '@core/shared/domain/validators/validation.error';
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
      eventId: new EventId(model.eventId),
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
