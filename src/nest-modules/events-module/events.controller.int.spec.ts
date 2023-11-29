import { EventOutputMapper } from '@core/event/application/commom/eventOutput';

import { CreateEventUseCase } from '@core/event/application/createEvent/createEvent.useCase';
import { DeleteEventUseCase } from '@core/event/application/deleteEvent/deleteEvent.useCase';
import { GetEventUseCase } from '@core/event/application/getEvent/getEvent.useCase';
import { ListEventsUseCase } from '@core/event/application/listEvent/listEvents.useCase';
import { UpdateEventUseCase } from '@core/event/application/updateEvent/updateEvent.useCase';
import { Event } from '@core/event/domain/eventEntity';
import { IEventRepository } from '@core/event/domain/eventRepository';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config-module/config.module';
import { DatabaseModule } from '../database-module/database.module';
import { EventsController } from './events.controller';
import { EventsModule } from './events.module';
import { EventCollectionPresenter, EventPresenter } from './events.presenter';
import { EVENT_PROVIDERS } from './events.providers';
import {
  CreateEventFixture,
  ListEventsFixture,
  UpdateEventFixture,
} from './testing/category-fixture';

describe('EventsController Integration Tests', () => {
  let controller: EventsController;
  let repository: IEventRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, EventsModule],
    }).compile();
    controller = module.get<EventsController>(EventsController);
    repository = module.get<IEventRepository>(
      EVENT_PROVIDERS.REPOSITORIES.EVENT_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateEventUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateEventUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListEventsUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetEventUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteEventUseCase);
  });

  describe('should create a EVENT', () => {
    const arrange = CreateEventFixture.arrangeForCreate();
    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(new Uuid(presenter.id));
        expect(entity!.toJSON()).toStrictEqual({
          eventId: presenter.id,
          createdAt: presenter.createdAt,
          ...expected,
        });
        const output = EventOutputMapper.toOutput(entity!);
        expect(presenter).toEqual(new EventPresenter(output));
      },
    );
  });

  describe('should update a Event', () => {
    const arrange = UpdateEventFixture.arrangeForUpdate();

    const event = Event.fake().aEvent().build();

    beforeEach(async () => {
      await repository.insert(event);
    });

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(event.eventId.id, send_data);
        const entity = await repository.findById(new Uuid(presenter.id));
        expect(entity!.toJSON()).toStrictEqual({
          eventId: presenter.id,
          createdAt: presenter.createdAt,
          name: expected.name ?? event.name,
          description:
            'description' in expected
              ? expected.description
              : event.description,
          is_active:
            expected.is_active === true || expected.is_active === false
              ? expected.is_active
              : event.is_active,
        });
        const output = EventOutputMapper.toOutput(entity!);
        expect(presenter).toEqual(new EventPresenter(output));
      },
    );
  });

  it('should delete a Event', async () => {
    const event = Event.fake().aEvent().build();
    await repository.insert(event);
    const response = await controller.remove(event.eventId.id);
    expect(response).not.toBeDefined();
    await expect(repository.findById(event.eventId)).resolves.toBeNull();
  });

  it('should get a Event', async () => {
    const event = Event.fake().aEvent().build();
    await repository.insert(event);
    const presenter = await controller.findOne(event.eventId.id);

    expect(presenter.id).toBe(event.eventId.id);
    expect(presenter.name).toBe(event.name);
    expect(presenter.description).toBe(event.description);
    expect(presenter.is_active).toBe(event.is_active);
    expect(presenter.createdAt).toStrictEqual(event.createdAt);
  });

  describe('search method', () => {
    describe('should sorted categories by createdAt', () => {
      const { entitiesMap, arrange } =
        ListEventsFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new EventCollectionPresenter({
              items: entities.map(EventOutputMapper.toOutput),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });

    describe('should return categories using pagination, sort and filter', () => {
      const { entitiesMap, arrange } = ListEventsFixture.arrangeUnsorted();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new EventCollectionPresenter({
              items: entities.map(EventOutputMapper.toOutput),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });
  });
});
