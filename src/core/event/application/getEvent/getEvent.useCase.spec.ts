import { Event, EventId } from '@core/event/domain/eventEntity.aggregate';
import { EventInMemoryRepository } from '@core/event/infra/db/inMemory/eventInMemory.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { InvalidUuidError } from '@core/shared/domain/value-objects/uuid.vo';
import { GetEventUseCase } from './getEvent.useCase';

describe('GetEventUseCase Unit Tests', () => {
  let useCase: GetEventUseCase;
  let repository: EventInMemoryRepository;

  beforeEach(() => {
    repository = new EventInMemoryRepository();
    useCase = new GetEventUseCase(repository);
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

  it('should returns a category', async () => {
    const items = [Event.create({ name: 'Movie' })];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: items[0].eventId.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].eventId.id,
      name: 'Movie',
      description: null,
      is_active: true,
      createdAt: items[0].createdAt,
    });
  });
});
