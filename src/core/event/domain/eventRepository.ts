import { SearchParams } from '@core/shared/domain/repository/search-params';
import { SearchResult } from '@core/shared/domain/repository/search-result';
import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Event } from './eventEntity';

export type EventFilter = string;

export class EventSearchParams extends SearchParams<EventFilter> {}

export class EventSearchResult extends SearchResult<Event> {}

export interface IEventRepository
  extends ISearchableRepository<
    Event,
    Uuid,
    EventFilter,
    EventSearchParams,
    EventSearchResult
  > {}
