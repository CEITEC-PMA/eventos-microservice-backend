import { Event } from '@core/event/domain/eventEntity.aggregate';
import { EventInMemoryRepository } from './eventInMemory.repository';

describe('EventInMemoryRepository', () => {
  let repository: EventInMemoryRepository;

  beforeEach(() => (repository = new EventInMemoryRepository()));
  it('should no filter items when filter object is null', async () => {
    const items = [Event.fake().aEvent().build()];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter items using filter parameter', async () => {
    const items = [
      Event.fake().aEvent().withName('test').build(),
      Event.fake().aEvent().withName('TEST').build(),
      Event.fake().aEvent().withName('fake').build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, 'TEST');
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('should sort by createdAt when sort param is null', async () => {
    const createdAt = new Date();

    const items = [
      Event.fake().aEvent().withName('test').withCreatedAt(createdAt).build(),
      Event.fake()
        .aEvent()
        .withName('TEST')
        .withCreatedAt(new Date(createdAt.getTime() + 100))
        .build(),
      Event.fake()
        .aEvent()
        .withName('fake')
        .withCreatedAt(new Date(createdAt.getTime() + 200))
        .build(),
    ];

    const itemsSorted = await repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name', async () => {
    const items = [
      Event.fake().aEvent().withName('c').build(),
      Event.fake().aEvent().withName('b').build(),
      Event.fake().aEvent().withName('a').build(),
    ];

    let itemsSorted = await repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
