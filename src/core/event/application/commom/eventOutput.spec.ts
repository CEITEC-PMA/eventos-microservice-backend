import { Event } from '@core/event/domain/eventEntity';
import { EventOutputMapper } from './eventOutput';

describe('EventOutputMapper Unit Tests', () => {
  it('should convert a EVENT in output', () => {
    const entity = Event.create({
      name: 'Movie',
      description: 'some description',
      is_active: true,
    });
    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = EventOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.eventId.id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      createdAt: entity.createdAt,
    });
  });
});
