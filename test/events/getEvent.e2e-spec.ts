import { EventOutputMapper } from '@core/event/application/commom/eventOutput';
import { Event } from '@core/event/domain/eventEntity';
import { IEventRepository } from '@core/event/domain/eventRepository';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { EventsController } from '../../src/nest-modules/events-module/events.controller';
import * as EventProviders from '../../src/nest-modules/events-module/events.providers';
import { GetEventFixture } from '../../src/nest-modules/events-module/testing/event.fixture';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';

describe('EventsController (e2e)', () => {
  const nestApp = startApp();
  describe('/events/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'Event Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/events/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a event ', async () => {
      const eventRepo = nestApp.app.get<IEventRepository>(
        EventProviders.REPOSITORIES.EVENT_REPOSITORY.provide,
      );
      const event = Event.fake().aEvent().build();
      await eventRepo.insert(event);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/events/${event.eventId.id}`)
        .expect(200);
      const keyInResponse = GetEventFixture.keysInResponse;
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

      const presenter = EventsController.serialize(
        EventOutputMapper.toOutput(event),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
