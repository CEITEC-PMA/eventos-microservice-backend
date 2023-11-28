import { Event } from '@core/event/domain/eventEntity';
import { EventInMemoryRepository } from '@core/event/infra/db/inMemory/eventInMemoryRepository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid.vo';
import { UpdateEventUseCase } from './updateEventUseCase';

describe('UpdateEventUseCase Unit Tests', () => {
  let useCase: UpdateEventUseCase;
  let repository: EventInMemoryRepository;

  beforeEach(() => {
    repository = new EventInMemoryRepository();
    useCase = new UpdateEventUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id', name: 'fake' }),
    ).rejects.toThrow(new InvalidUuidError());

    const eventId = new Uuid();

    await expect(() =>
      useCase.execute({ id: eventId.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(eventId.id, Event));
  });

  it('should throw an error when aggregate is not valid', async () => {
    const aggregate = new Event({ name: 'Movie' });
    repository.items = [aggregate];
    await expect(() =>
      useCase.execute({
        id: aggregate.eventId.id,
        name: 't'.repeat(256),
      }),
    ).rejects.toThrow('Entity Validation Error');
  });

  it('should update a EVENT', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new Event({ name: 'Movie' });
    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.eventId.id,
      name: 'test',
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.eventId.id,
      name: 'test',
      description: null,
      is_active: true,
      createdAt: entity.createdAt,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        is_active?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        is_active: boolean;
        createdAt: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.eventId.id,
          name: 'test',
          description: 'some description',
        },
        expected: {
          id: entity.eventId.id,
          name: 'test',
          description: 'some description',
          is_active: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.eventId.id,
          name: 'test',
        },
        expected: {
          id: entity.eventId.id,
          name: 'test',
          description: 'some description',
          is_active: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.eventId.id,
          name: 'test',
          is_active: false,
        },
        expected: {
          id: entity.eventId.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.eventId.id,
          name: 'test',
        },
        expected: {
          id: entity.eventId.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.eventId.id,
          name: 'test',
          is_active: true,
        },
        expected: {
          id: entity.eventId.id,
          name: 'test',
          description: 'some description',
          is_active: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.eventId.id,
          name: 'test',
          description: 'some description',
          is_active: false,
        },
        expected: {
          id: entity.eventId.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          createdAt: entity.createdAt,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...('name' in i.input && { name: i.input.name }),
        ...('description' in i.input && { description: i.input.description }),
        ...('is_active' in i.input && { is_active: i.input.is_active }),
      });
      expect(output).toStrictEqual({
        id: entity.eventId.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        createdAt: entity.createdAt,
      });
    }
  });
});
