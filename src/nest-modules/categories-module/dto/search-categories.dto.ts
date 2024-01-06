import { ListCategoriesInput } from '@core/category/application/useCases/listCategories/listCategories.useCase';
import { SortDirection } from '../../../core/shared/domain/repository/search-params';

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
