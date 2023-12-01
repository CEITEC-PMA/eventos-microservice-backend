import { Event, EventId } from '@core/event/domain/eventEntity.aggregate';
import { LoadEntityError } from '@core/shared/domain/validators/validation.error';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { EventModel } from './eventModel';
import { EventModelMapper } from './eventModel.mapper';

describe('EventModelMapper Integration Tests', () => {
  setupSequelize({ models: [EventModel] });

  it('should throws error when category is invalid', () => {
    expect.assertions(2);

    //@ts-expect-error - This is an invalid category
    const model = EventModel.build({
      eventId: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'a'.repeat(256),
    });
    try {
      EventModelMapper.toEntity(model);
      fail(
        'The category is valid, but it needs throws a EntityValidationError',
      );
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect((e as LoadEntityError).error).toMatchObject([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    }
  });

  it('should convert a category model to a category aggregate', () => {
    const createdAt = new Date();
    const model = EventModel.build({
      eventId: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'some value',
      description: 'some description',
      is_active: true,
      createdAt,
    });
    const aggregate = EventModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new Event({
        eventId: new EventId('5490020a-e866-4229-9adc-aa44b83234c4'),
        name: 'some value',
        description: 'some description',
        is_active: true,
        createdAt,
      }).toJSON(),
    );
  });
});
