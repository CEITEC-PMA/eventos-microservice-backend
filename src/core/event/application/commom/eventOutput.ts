import { Event } from '@core/event/domain/eventEntity';

export type EventOutput = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt: Date;
};

export class EventOutputMapper {
  static toOutput(entity: Event): EventOutput {
    const { eventId, ...otherProps } = entity.toJSON();
    return {
      id: eventId,
      ...otherProps,
    };
  }
}
