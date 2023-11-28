import {
  EventFilter,
  IEventRepository,
} from '@core/event/domain/eventRepository';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { Event } from '../../../domain/eventEntity';

export class EventInMemoryRepository
  extends InMemorySearchableRepository<Event, Uuid>
  implements IEventRepository
{
  sortableFields: string[] = ['name', 'createdAt'];

  protected async applyFilter(
    items: Event[],
    filter: EventFilter | null,
  ): Promise<Event[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  getEntity(): new (...args: any[]) => Event {
    return Event;
  }

  protected applySort(
    items: Event[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'createdAt', 'desc');
  }
}
