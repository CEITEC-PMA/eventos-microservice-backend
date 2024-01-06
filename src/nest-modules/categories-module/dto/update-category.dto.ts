import { UpdateCategoryInput } from '@core/category/application/useCases/updateCategory/updateCategory.input';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateCategoryInputWithoutId extends OmitType(
  UpdateCategoryInput,
  ['id'] as const,
) {}

export class UpdateCategoryDto extends UpdateCategoryInputWithoutId {}
