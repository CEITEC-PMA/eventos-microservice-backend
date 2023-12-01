import { Event, EventId } from '@core/event/domain/eventEntity.aggregate';
import { EventModel } from '@core/event/infra/db/sequelize/eventModel';
import { EventSequelizeRepository } from '@core/event/infra/db/sequelize/eventSequelize.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { GetEventUseCase } from './getEvent.useCase';

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetEventUseCase;
  let repository: EventSequelizeRepository;

  setupSequelize({ models: [EventModel] });

  beforeEach(() => {
    repository = new EventSequelizeRepository(EventModel);
    useCase = new GetEventUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const eventId = new EventId();
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
