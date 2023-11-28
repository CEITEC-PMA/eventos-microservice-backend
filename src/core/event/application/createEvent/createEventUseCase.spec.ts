import { EventInMemoryRepository } from '@core/event/infra/db/inMemory/eventInMemoryRepository';
import { CreateEventUseCase } from './createEventUseCase';

describe('CreateCategoryUseCase Unit Tests', () => {
  let useCase: CreateEventUseCase;
  let repository: EventInMemoryRepository;

  beforeEach(() => {
    repository = new EventInMemoryRepository();
    useCase = new CreateEventUseCase(repository);
  });

  it('should throw an error when aggregate is not valid', async () => {
    const input = { name: 't'.repeat(256) };
    await expect(() => useCase.execute(input)).rejects.toThrowError(
      'Entity Validation Error',
    );
  });

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({ name: 'test' });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].eventId.id,
      name: 'test',
      description: null,
      is_active: true,
      createdAt: repository.items[0].createdAt,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: false,
    });
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].eventId.id,
      name: 'test',
      description: 'some description',
      is_active: false,
      createdAt: repository.items[1].createdAt,
    });
  });
});
