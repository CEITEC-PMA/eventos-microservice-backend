import { EventOutputMapper } from '@core/event/application/commom/eventOutput';
import { EventId } from '@core/event/domain/eventEntity.aggregate';
import { IEventRepository } from '@core/event/domain/eventRepository';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { EventsController } from '../../src/nest-modules/events-module/events.controller';
import { EVENT_PROVIDERS } from '../../src/nest-modules/events-module/events.providers';
import { CreateEventFixture } from '../../src/nest-modules/events-module/testing/event.fixture';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';

describe('EventsController (e2e)', () => {
  const appHelper = startApp();
  let eventRepo: IEventRepository;

  beforeEach(async () => {
    eventRepo = appHelper.app.get<IEventRepository>(
      EVENT_PROVIDERS.REPOSITORIES.EVENT_REPOSITORY.provide,
    );
  });
  describe('/events (POST)', () => {
    describe('should return a response error with 422 status code when request body is invalid', () => {
      const invalidRequest = CreateEventFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/events')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return a response error with 422 status code when throw EntityValidationError', () => {
      const invalidRequest =
        CreateEventFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/events')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should create a EVENT', () => {
      const arrange = CreateEventFixture.arrangeForCreate();

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post('/events')
            .send(send_data)
            .expect(201);

          const keysInResponse = CreateEventFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const id = res.body.data.id;
          const eventCreated = await eventRepo.findById(new EventId(id));

          const presenter = EventsController.serialize(
            EventOutputMapper.toOutput(eventCreated!),
          );
          const serialized = instanceToPlain(presenter);

          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            createdAt: serialized.createdAt,
            ...expected,
          });
        },
      );
    });
  });
});
