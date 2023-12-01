import { SearchParams } from '@core/shared/domain/repository/search-params';
import { SearchResult } from '@core/shared/domain/repository/search-result';
import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import { Event, EventId } from './eventEntity.aggregate';

export type EventFilter = string;

export class EventSearchParams extends SearchParams<EventFilter> {}

export class EventSearchResult extends SearchResult<Event> {}

export interface IEventRepository
  extends ISearchableRepository<
    Event,
    EventId,
    EventFilter,
    EventSearchParams,
    EventSearchResult
  > {}
