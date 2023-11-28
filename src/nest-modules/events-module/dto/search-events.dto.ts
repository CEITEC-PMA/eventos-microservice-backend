import { ListEventsInput } from '@core/event/application/listEvent/listEventsUseCase';
import { SortDirection } from '@core/shared/domain/repository/search-params';

export class SearchEventsDto implements ListEventsInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
