import { Event } from '@core/event/domain/eventEntity';
import { EventSearchResult } from '@core/event/domain/eventRepository';
import { EventInMemoryRepository } from '@core/event/infra/db/inMemory/eventInMemory.repository';
import { EventOutputMapper } from '../commom/eventOutput';
import { ListEventsUseCase } from './listEvents.useCase';

describe('ListEventssUseCase Unit Tests', () => {
  let useCase: ListEventsUseCase;
  let repository: EventInMemoryRepository;

  beforeEach(() => {
    repository = new EventInMemoryRepository();
    useCase = new ListEventsUseCase(repository);
  });

  test('toOutput method', () => {
    let result = new EventSearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    let output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const entity = Event.create({ name: 'Movie' });
    result = new EventSearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [entity].map(EventOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it('should return output sorted by createdAt when input param is empty', async () => {
    const items = [
      new Event({ name: 'test 1' }),
      new Event({
        name: 'test 2',
        createdAt: new Date(new Date().getTime() + 100),
      }),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map(EventOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should return output using pagination, sort and filter', async () => {
    const items = [
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
    repository.items = items;

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(EventOutputMapper.toOutput),
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
    expect(output).toStrictEqual({
      items: [items[0]].map(EventOutputMapper.toOutput),
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
    expect(output).toStrictEqual({
      items: [items[0], items[2]].map(EventOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
