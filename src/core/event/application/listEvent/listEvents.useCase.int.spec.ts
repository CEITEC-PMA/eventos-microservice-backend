import { Event } from '@core/event/domain/eventEntity.aggregate';
import { EventModel } from '@core/event/infra/db/sequelize/eventModel';
import { EventSequelizeRepository } from '@core/event/infra/db/sequelize/eventSequelize.repository';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { EventOutputMapper } from '../commom/eventOutput';
import { ListEventsUseCase } from './listEvents.useCase';

describe('ListEventsUseCase Integration Tests', () => {
  let useCase: ListEventsUseCase;
  let repository: EventSequelizeRepository;

  setupSequelize({ models: [EventModel] });

  beforeEach(() => {
    repository = new EventSequelizeRepository(EventModel);
    useCase = new ListEventsUseCase(repository);
  });

  it('should return output sorted by createdAt when input param is empty', async () => {
    const events = Event.fake()
      .theEvents(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(events);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...events].reverse().map(EventOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should returns output using pagination, sort and filter', async () => {
    const events = [
      new Event({ name: 'a' }),
      new Event({
        name: 'AAA',
      }),
      new Event({
        name: 'AaA',
      }),
      new Event({
        name: 'b',
      }),
      new Event({
        name: 'c',
      }),
    ];
    await repository.bulkInsert(events);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toEqual({
      items: [events[1], events[2]].map(EventOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toEqual({
      items: [events[0]].map(EventOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    });
    expect(output).toEqual({
      items: [events[0], events[2]].map(EventOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
