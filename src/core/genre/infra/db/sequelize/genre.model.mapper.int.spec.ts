import { Category } from '@core/category/domain/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category.sequelize.repository';
import { Genre, GenreId } from '@core/genre/domain/genre.aggregate';
import { LoadEntityError } from '@core/shared/domain/validators/validation.error';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { GenreModelMapper } from '../in-memory/genre.model.mapper';
import { GenreCategoryModel, GenreModel } from './genre.model';

describe('GenreModelMapper Unit Tests', () => {
  let categoryRepo: ICategoryRepository;
  setupSequelize({ models: [CategoryModel, GenreModel, GenreCategoryModel] });

  beforeEach(() => {
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
  });

  it('should throws error when genre is invalid', () => {
    const arrange = [
      {
        makeModel: () => {
          //@ts-expect-error - an invalid genre
          return GenreModel.build({
            genreId: '9366b7dc-2d71-4799-b91c-c64adb205104',
            name: 't'.repeat(256),
            categoriesId: [],
          });
        },
        expectedErrors: [
          {
            categoriesId: ['categoriesId should not be empty'],
          },
          {
            name: ['name must be shorter than or equal to 255 characters'],
          },
        ],
      },
    ];

    for (const item of arrange) {
      try {
        GenreModelMapper.toEntity(item.makeModel());
        fail('The genre is valid, but it needs throws a LoadEntityError');
      } catch (e) {
        expect(e).toBeInstanceOf(LoadEntityError);
        expect(e.error).toMatchObject(item.expectedErrors);
      }
    }
  });

  it('should convert a genre model to a genre entity', async () => {
    const category1 = Category.fake().aCategory().build();
    const category2 = Category.fake().aCategory().build();
    await categoryRepo.bulkInsert([category1, category2]);
    const created_at = new Date();
    const model = await GenreModel.create(
      {
        genreId: '5490020a-e866-4229-9adc-aa44b83234c4',
        name: 'some value',
        categoriesId: [
          GenreCategoryModel.build({
            genreId: '5490020a-e866-4229-9adc-aa44b83234c4',
            categoryId: category1.categoryId.id,
          }),
          GenreCategoryModel.build({
            genreId: '5490020a-e866-4229-9adc-aa44b83234c4',
            categoryId: category2.categoryId.id,
          }),
        ],
        is_active: true,
        created_at,
      },
      { include: ['categoriesId'] },
    );
    const entity = GenreModelMapper.toEntity(model);
    expect(entity.toJSON()).toEqual(
      new Genre({
        genreId: new GenreId('5490020a-e866-4229-9adc-aa44b83234c4'),
        name: 'some value',
        categoriesId: new Map([
          [category1.categoryId.id, category1.categoryId],
          [category2.categoryId.id, category2.categoryId],
        ]),
        is_active: true,
        createdAt,
      }).toJSON(),
    );
  });
});
