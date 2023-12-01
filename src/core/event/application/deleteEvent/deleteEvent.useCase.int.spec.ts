import { Event, EventId } from '@core/event/domain/eventEntity.aggregate';
import { EventModel } from '@core/event/infra/db/sequelize/eventModel';
import { EventSequelizeRepository } from '@core/event/infra/db/sequelize/eventSequelize.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { DeleteEventUseCase } from './deleteEvent.useCase';

describe('DeleteEventUseCase Integration Tests', () => {
  let useCase: DeleteEventUseCase;
  let repository: EventSequelizeRepository;

  setupSequelize({ models: [EventModel] });

  beforeEach(() => {
    repository = new EventSequelizeRepository(EventModel);
    useCase = new DeleteEventUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const eventId = new EventId();
    await expect(() => useCase.execute({ id: eventId.id })).rejects.toThrow(
      new NotFoundError(eventId.id, Event),
    );
  });

  it('should delete a category', async () => {
    const event = Event.fake().aEvent().build();
    await repository.insert(event);
    await useCase.execute({
      id: event.eventId.id,
    });
    await expect(repository.findById(event.eventId)).resolves.toBeNull();
  });
});
