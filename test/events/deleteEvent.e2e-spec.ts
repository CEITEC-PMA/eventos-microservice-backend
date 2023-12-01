import { Event } from '@core/event/domain/eventEntity';
import { IEventRepository } from '@core/event/domain/eventRepository';
import request from 'supertest';
import * as EventProviders from '../../src/nest-modules/events-module/events.providers';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';

describe('EventsController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const appHelper = startApp();
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
        return request(appHelper.app.getHttpServer())
          .delete(`/events/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a event response with status 204', async () => {
      const eventRepo = appHelper.app.get<IEventRepository>(
        EventProviders.REPOSITORIES.EVENT_REPOSITORY.provide,
      );
      const event = Event.fake().aEvent().build();
      await eventRepo.insert(event);

      await request(appHelper.app.getHttpServer())
        .delete(`/events/${event.eventId.id}`)
        .expect(204);

      await expect(eventRepo.findById(event.eventId)).resolves.toBeNull();
    });
  });
});
