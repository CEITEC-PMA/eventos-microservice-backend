import { CategoryId } from '../../../../category/domain/category.aggregate';
import { Notification } from '../../../../shared/domain/validators/notification';
import { LoadEntityError } from '../../../../shared/domain/validators/validation.error';
import { Genre, GenreId } from '../../../domain/genre.aggregate';
import { GenreCategoryModel, GenreModel } from '../sequelize/genre.model';

export class GenreModelMapper {
  static toEntity(model: GenreModel) {
    const { genreId: id, categoriesId = [], ...otherData } = model.toJSON();
    const categoriesId = categoriesId.map((c) => new CategoryId(c.categoryId));

    const notification = new Notification();
    if (!categoriesId.length) {
      notification.addError(
        'categories_id should not be empty',
        'categories_id',
      );
    }

    const genre = new Genre({
      ...otherData,
      genreId: new GenreId(id),
      categoriesId: new Map(categoriesId.map((c) => [c.id, c])),
    });

    genre.validate();

    notification.copyErrors(genre.notification);

    if (notification.hasErrors()) {
      throw new LoadEntityError(notification.toJSON());
    }

    return genre;
  }

  static toModelProps(aggregate: Genre) {
    const { categoriesId, ...otherData } = aggregate.toJSON();
    return {
      ...otherData,
      categoriesId: categoriesId.map(
        (categoryId) =>
          new GenreCategoryModel({
            genreId: aggregate.genreId.id,
            categoryId: categoryId,
          }),
      ),
    };
  }
}
