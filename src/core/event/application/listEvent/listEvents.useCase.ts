import {
  EventFilter,
  EventSearchParams,
  EventSearchResult,
  IEventRepository,
} from '@core/event/domain/eventRepository';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@core/shared/application/pagination-output';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { EventOutput, EventOutputMapper } from '../commom/eventOutput';

export class ListEventsUseCase
  implements IUseCase<ListEventsInput, ListEventsOutput>
{
  constructor(private eventRepo: IEventRepository) {}

  async execute(input: ListEventsInput): Promise<ListEventsOutput> {
    const params = new EventSearchParams(input);
    const searchResult = await this.eventRepo.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: EventSearchResult): ListEventsOutput {
    const { items: _items } = searchResult;
    const items = _items.map((i) => {
      return EventOutputMapper.toOutput(i);
    });
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListEventsInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: EventFilter | null;
};

export type ListEventsOutput = PaginationOutput<EventOutput>;
