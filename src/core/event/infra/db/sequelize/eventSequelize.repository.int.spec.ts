import { Event, EventId } from '@core/event/domain/eventEntity.aggregate';
import {
  EventSearchParams,
  EventSearchResult,
} from '@core/event/domain/eventRepository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { EventModel } from './eventModel';
import { EventModelMapper } from './eventModel.mapper';
import { EventSequelizeRepository } from './eventSequelize.repository';

describe('EventSequelizeRepository Integration Test', () => {
  let repository: EventSequelizeRepository;
  setupSequelize({ models: [EventModel] });

  beforeEach(async () => {
    repository = new EventSequelizeRepository(EventModel);
  });

  it('should inserts a new entity', async () => {
    const event = Event.fake().aEvent().build();
    await repository.insert(event);
    const eventCreated = await repository.findById(event.eventId);
    expect(eventCreated!.toJSON()).toStrictEqual(event.toJSON());
  });

  it('should finds a entity by id', async () => {
    let entityFound = await repository.findById(new EventId());
    expect(entityFound).toBeNull();

    const entity = Event.fake().aEvent().build();
    await repository.insert(entity);
    entityFound = await repository.findById(entity.eventId);
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  it('should return all categories', async () => {
    const entity = Event.fake().aEvent().build();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it('should throw error on update when a entity not found', async () => {
    const entity = Event.fake().aEvent().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.eventId.id, Event),
    );
  });

  it('should update a entity', async () => {
    const entity = Event.fake().aEvent().build();
    await repository.insert(entity);

    entity.changeName('Movie updated');
    await repository.update(entity);

    const entityFound = await repository.findById(entity.eventId);
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  it('should throw error on delete when a entity not found', async () => {
    const eventId = new EventId();
    await expect(repository.delete(eventId)).rejects.toThrow(
      new NotFoundError(eventId.id, Event),
    );
  });

  it('should delete a entity', async () => {
    const entity = new Event({ name: 'Movie' });
    await repository.insert(entity);

    await repository.delete(entity.eventId);
    await expect(repository.findById(entity.eventId)).resolves.toBeNull();
  });

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const createdAt = new Date();
      const events = Event.fake()
        .theEvents(16)
        .withName('Movie')
        .withDescription(null)
        .withCreatedAt(createdAt)
        .build();
      await repository.bulkInsert(events);
      const spyToEntity = jest.spyOn(EventModelMapper, 'toEntity');

      const searchOutput = await repository.search(new EventSearchParams());
      expect(searchOutput).toBeInstanceOf(EventSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Event);
        expect(item.eventId).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          is_active: true,
          createdAt,
        }),
      );
    });

    it('should order by createdAt DESC when search params are null', async () => {
      const createdAt = new Date();
      const events = Event.fake()
        .theEvents(16)
        .withName((index) => `Movie ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(createdAt.getTime() + index))
        .build();
      const searchOutput = await repository.search(new EventSearchParams());
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`Movie ${index}`).toBe(`${events[index + 1].name}`);
      });
    });

    it('should apply paginate and filter', async () => {
      const events = [
        Event.fake()
          .aEvent()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Event.fake()
          .aEvent()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Event.fake()
          .aEvent()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Event.fake()
          .aEvent()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(events);

      let searchOutput = await repository.search(
        new EventSearchParams({
          page: 1,
          per_page: 2,
          filter: 'TEST',
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new EventSearchResult({
          items: [events[0], events[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      );

      searchOutput = await repository.search(
        new EventSearchParams({
          page: 2,
          per_page: 2,
          filter: 'TEST',
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new EventSearchResult({
          items: [events[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true),
      );
    });

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'createdAt']);

      const events = [
        Event.fake().aEvent().withName('b').build(),
        Event.fake().aEvent().withName('a').build(),
        Event.fake().aEvent().withName('d').build(),
        Event.fake().aEvent().withName('e').build(),
        Event.fake().aEvent().withName('c').build(),
      ];
      await repository.bulkInsert(events);

      const arrange = [
        {
          params: new EventSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
          }),
          result: new EventSearchResult({
            items: [events[1], events[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new EventSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
          }),
          result: new EventSearchResult({
            items: [events[4], events[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: new EventSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new EventSearchResult({
            items: [events[3], events[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new EventSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new EventSearchResult({
            items: [events[4], events[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe('should search using filter, sort and paginate', () => {
      const events = [
        Event.fake().aEvent().withName('test').build(),
        Event.fake().aEvent().withName('a').build(),
        Event.fake().aEvent().withName('TEST').build(),
        Event.fake().aEvent().withName('e').build(),
        Event.fake().aEvent().withName('TeSt').build(),
      ];

      const arrange = [
        {
          search_params: new EventSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new EventSearchResult({
            items: [events[2], events[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new EventSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new EventSearchResult({
            items: [events[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(events);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });
  });
});
