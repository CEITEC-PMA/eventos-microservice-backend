import { Event } from '@core/event/domain/eventEntity';
import { EventModel } from '@core/event/infra/db/sequelize/eventModel';
import { EventSequelizeRepository } from '@core/event/infra/db/sequelize/eventSequelizeRepository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { UpdateEventUseCase } from './updateEventUseCase';

describe('UpdateEventUseCase Integration Tests', () => {
  let useCase: UpdateEventUseCase;
  let repository: EventSequelizeRepository;

  setupSequelize({ models: [EventModel] });

  beforeEach(() => {
    repository = new EventSequelizeRepository(EventModel);
    useCase = new UpdateEventUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const eventId = new Uuid();
    await expect(() =>
      useCase.execute({ id: eventId.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(eventId.id, Event));
  });

  it('should update a EVENT', async () => {
    const entity = Event.fake().aEvent().build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.eventId.id,
      name: 'test',
    });
    expect(output).toStrictEqual({
      id: entity.eventId.id,
      name: 'test',
      description: entity.description,
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
          description: null,
          is_active: false,
        },
        expected: {
          id: entity.eventId.id,
          name: 'test',
          description: null,
          is_active: false,
          createdAt: entity.createdAt,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...(i.input.name && { name: i.input.name }),
        ...('description' in i.input && { description: i.input.description }),
        ...('is_active' in i.input && { is_active: i.input.is_active }),
      });
      const entityUpdated = await repository.findById(new Uuid(i.input.id));
      expect(output).toStrictEqual({
        id: entity.eventId.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        createdAt: entityUpdated!.createdAt,
      });
      expect(entityUpdated!.toJSON()).toStrictEqual({
        eventId: entity.eventId.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        createdAt: entityUpdated!.createdAt,
      });
    }
  });
});
