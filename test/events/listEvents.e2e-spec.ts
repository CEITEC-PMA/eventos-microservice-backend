import { EventOutputMapper } from '@core/event/application/commom/eventOutput';
import { IEventRepository } from '@core/event/domain/eventRepository';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { EventsController } from '../../src/nest-modules/events-module/events.controller';
import * as EventProviders from '../../src/nest-modules/events-module/events.providers';
import { ListEventsFixture } from '../../src/nest-modules/events-module/testing/event.fixture';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';

describe('EventsController (e2e)', () => {
  describe('/events (GET)', () => {
    describe('should return events sorted by createdAt when request query is empty', () => {
      let eventRepo: IEventRepository;
      const nestApp = startApp();
      const { entitiesMap, arrange } =
        ListEventsFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        eventRepo = nestApp.app.get<IEventRepository>(
          EventProviders.REPOSITORIES.EVENT_REPOSITORY.provide,
        );
        await eventRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(nestApp.app.getHttpServer())
            .get(`/events/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  EventsController.serialize(EventOutputMapper.toOutput(e)),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });

    describe('should return events using paginate, filter and sort', () => {
      let eventRepo: IEventRepository;
      const nestApp = startApp();
      const { entitiesMap, arrange } = ListEventsFixture.arrangeUnsorted();

      beforeEach(async () => {
        eventRepo = nestApp.app.get<IEventRepository>(
          EventProviders.REPOSITORIES.EVENT_REPOSITORY.provide,
        );
        await eventRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each([arrange])(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(nestApp.app.getHttpServer())
            .get(`/events/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  EventsController.serialize(EventOutputMapper.toOutput(e)),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });
  });
});
