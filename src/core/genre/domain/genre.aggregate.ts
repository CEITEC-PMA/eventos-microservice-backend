import { CategoryId } from '@core/category/domain/category.aggregate';
import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { GenreValidatorFactory } from './genre.validator';
import { GenreFakeBuilder } from './genreFaker.builder';

export type GenreContructorProps = {
  genreId?: GenreId;
  name: string;
  categoriesId: Map<string, CategoryId>;
  is_active?: boolean;
  createdAt?: Date;
};

export type GenreCreateCommand = {
  name: string;
  categoriesId: CategoryId[];
  is_active?: boolean;
};

export class GenreId extends Uuid {}

export class Genre extends AggregateRoot {
  genreId: GenreId;
  name: string;
  categoriesId: Map<string, CategoryId>;
  is_active: boolean;
  createdAt: Date;

  constructor(props: GenreContructorProps) {
    super();
    this.genreId = props.genreId ?? new GenreId();
    this.name = props.name;
    this.categoriesId = props.categoriesId;
    this.is_active = props.is_active ?? true;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: GenreCreateCommand) {
    const genre = new Genre({
      ...props,
      categoriesId: new Map(
        props.categoriesId.map((categoriesId) => [
          categoriesId.id,
          categoriesId,
        ]),
      ),
    });

    genre.validate();
    return genre;
  }

  changeName(name: string) {
    this.name = name;
  }

  addCategoryId(categoryId: CategoryId) {
    this.categoriesId.set(categoryId.id, categoryId);
  }

  removeCategoryId(categoryId: CategoryId) {
    this.categoriesId.delete(categoryId.id);
  }

  syncCategoriesId(categoriesId: CategoryId[]) {
    if (categoriesId.length) {
      throw new Error('Categories id is empty');
    }

    this.categoriesId = new Map(
      categoriesId.map((categoriesId) => [categoriesId.id, categoriesId]),
    );
  }

  active() {
    this.is_active = true;
  }

  deactive() {
    this.is_active = false;
  }

  get entity_id() {
    return this.genreId;
  }

  validate(fields?: string[]) {
    const validator = GenreValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return GenreFakeBuilder;
  }

  toJSON() {
    return {
      genreId: this.genreId.id,
      name: this.name,
      categoriesId: Array.from(this.categoriesId.values()).map(
        (categoriesId) => categoriesId.id,
      ),
      is_active: this.is_active,
      createdAt: this.createdAt,
    };
  }
}
