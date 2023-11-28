import { Event } from '@core/event/domain/eventEntity';
import { EventModel } from '@core/event/infra/db/sequelize/eventModel';
import { EventSequelizeRepository } from '@core/event/infra/db/sequelize/eventSequelizeRepository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { GetEventUseCase } from './getEventUseCase';

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetEventUseCase;
  let repository: EventSequelizeRepository;

  setupSequelize({ models: [EventModel] });

  beforeEach(() => {
    repository = new EventSequelizeRepository(EventModel);
    useCase = new GetEventUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const eventId = new Uuid();
    await expect(() => useCase.execute({ id: eventId.id })).rejects.toThrow(
      new NotFoundError(eventId.id, Event),
    );
  });

  it('should returns a category', async () => {
    const event = Event.fake().aEvent().build();
    await repository.insert(event);
    const output = await useCase.execute({ id: event.eventId.id });
    expect(output).toStrictEqual({
      id: event.eventId.id,
      name: event.name,
      description: event.description,
      is_active: event.is_active,
      createdAt: event.createdAt,
    });
  });
});
