import { EventModel } from '@core/event/infra/db/sequelize/eventModel';
import { EventSequelizeRepository } from '@core/event/infra/db/sequelize/eventSequelize.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CreateEventUseCase } from './createEvent.useCase';

describe('CreateEventUseCase Integration Tests', () => {
  let useCase: CreateEventUseCase;
  let repository: EventSequelizeRepository;

  setupSequelize({ models: [EventModel] });

  beforeEach(() => {
    repository = new EventSequelizeRepository(EventModel);
    useCase = new CreateEventUseCase(repository);
  });

  it('should create a category', async () => {
    let output = await useCase.execute({ name: 'test' });
    let entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.eventId.id,
      name: 'test',
      description: null,
      is_active: true,
      createdAt: entity!.createdAt,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.eventId.id,
      name: 'test',
      description: 'some description',
      is_active: true,
      createdAt: entity!.createdAt,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: true,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.eventId.id,
      name: 'test',
      description: 'some description',
      is_active: true,
      createdAt: entity!.createdAt,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: false,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity!.eventId.id,
      name: 'test',
      description: 'some description',
      is_active: false,
      createdAt: entity!.createdAt,
    });
  });
});
