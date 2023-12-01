import { EventOutputMapper } from '@core/event/application/commom/eventOutput';
import { Event } from '@core/event/domain/eventEntity';
import { IEventRepository } from '@core/event/domain/eventRepository';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { EventsController } from '../../src/nest-modules/events-module/events.controller';
import * as EventProviders from '../../src/nest-modules/events-module/events.providers';
import { UpdateEventFixture } from '../../src/nest-modules/events-module/testing/event.fixture';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';

describe('EventsController (e2e)', () => {
  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  describe('/events/:id (PATCH)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = Event.fake().aEvent();
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          send_data: { name: faker.name },
          expected: {
            message:
              'Event Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          send_data: { name: faker.name },
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .patch(`/events/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = UpdateEventFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .patch(`/events/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response error with 422 when throw EntityValidationError', () => {
      const app = startApp();
      const validationError =
        UpdateEventFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));
      let eventRepo: IEventRepository;

      beforeEach(() => {
        eventRepo = app.app.get<IEventRepository>(
          EventProviders.REPOSITORIES.EVENT_REPOSITORY.provide,
        );
      });
      test.each(arrange)('when body is $label', async ({ value }) => {
        const event = Event.fake().aEvent().build();
        await eventRepo.insert(event);
        return request(app.app.getHttpServer())
          .patch(`/events/${event.eventId.id}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a event', () => {
      const appHelper = startApp();
      const arrange = UpdateEventFixture.arrangeForUpdate();
      let eventRepo: IEventRepository;

      beforeEach(async () => {
        eventRepo = appHelper.app.get<IEventRepository>(
          EventProviders.REPOSITORIES.EVENT_REPOSITORY.provide,
        );
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const eventCreated = Event.fake().aEvent().build();
          await eventRepo.insert(eventCreated);

          const res = await request(appHelper.app.getHttpServer())
            .patch(`/events/${eventCreated.eventId.id}`)
            .send(send_data)
            .expect(200);
          const keyInResponse = UpdateEventFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
          const id = res.body.data.id;
          const eventUpdated = await eventRepo.findById(new Uuid(id));
          const presenter = EventsController.serialize(
            EventOutputMapper.toOutput(eventUpdated!),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual(serialized);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            createdAt: serialized.createdAt,
            name: expected.name ?? eventUpdated!.name,
            description:
              'description' in expected
                ? expected.description
                : eventUpdated!.description,
            is_active: expected.is_active ?? eventUpdated!.is_active,
          });
        },
      );
    });
  });
});
