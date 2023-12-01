import { Event, EventId } from '@core/event/domain/eventEntity.aggregate';
import { EventInMemoryRepository } from '@core/event/infra/db/inMemory/eventInMemory.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { InvalidUuidError } from '@core/shared/domain/value-objects/uuid.vo';
import { DeleteEventUseCase } from './deleteEvent.useCase';

describe('DeleteEventUseCase Unit Tests', () => {
  let useCase: DeleteEventUseCase;
  let repository: EventInMemoryRepository;

  beforeEach(() => {
    repository = new EventInMemoryRepository();
    useCase = new DeleteEventUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const eventId = new EventId();

    await expect(() => useCase.execute({ id: eventId.id })).rejects.toThrow(
      new NotFoundError(eventId.id, Event),
    );
  });

  it('should delete a EVENT', async () => {
    const items = [new Event({ name: 'test 1' })];
    repository.items = items;
    await useCase.execute({
      id: items[0].eventId.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
