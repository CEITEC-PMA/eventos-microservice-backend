import { Category } from '@core/category/domain/category.aggregate';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category.sequelize.repository';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { DataType } from 'sequelize-typescript';
import { GenreCategoryModel, GenreModel } from './genre.model';

describe('GenreCategoryModel Integration Tests', () => {
  setupSequelize({
    models: [CategoryModel, GenreModel, GenreCategoryModel],
  });

  test('table name', () => {
    expect(GenreCategoryModel.tableName).toBe('category_genre');
  });

  test('mapping props', () => {
    const attributesMap = GenreCategoryModel.getAttributes();
    const attributes = Object.keys(GenreCategoryModel.getAttributes());
    expect(attributes).toStrictEqual(['genreId', 'categoryId']);

    const genreIdAttr = attributesMap.genreId;
    expect(genreIdAttr).toMatchObject({
      field: 'genreId',
      fieldName: 'genreId',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'genres',
        key: 'genreId',
      },
      unique: 'category_genre_genreId_categoryId_unique',
    });

    const categoryIdAttr = attributesMap.categoryId;
    expect(categoryIdAttr).toMatchObject({
      field: 'categoryId',
      fieldName: 'categoryId',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'categories',
        key: 'categoryId',
      },
      unique: 'category_genre_genreId_categoryId_unique',
    });
  });
});

describe('GenreModel Integration Tests', () => {
  setupSequelize({
    models: [CategoryModel, GenreModel, GenreCategoryModel],
  });

  test('table name', () => {
    expect(GenreModel.tableName).toBe('genres');
  });

  test('mapping props', () => {
    const attributesMap = GenreModel.getAttributes();
    const attributes = Object.keys(GenreModel.getAttributes());
    expect(attributes).toStrictEqual([
      'genreId',
      'name',
      'is_active',
      'createdAt',
    ]);

    const genreIdAttr = attributesMap.genreId;
    expect(genreIdAttr).toMatchObject({
      field: 'genreId',
      fieldName: 'genreId',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributesMap.createdAt;
    expect(createdAtAttr).toMatchObject({
      field: 'createdAt',
      fieldName: 'createdAt',
      allowNull: false,
      type: DataType.DATE(6),
    });
  });

  test('mapping associations', () => {
    const associationsMap = GenreModel.associations;
    const associations = Object.keys(associationsMap);
    expect(associations).toStrictEqual(['categoriesId', 'categories']);

    const categoriesIdRelation = associationsMap.categoriesId;
    expect(categoriesIdRelation).toMatchObject({
      associationType: 'HasMany',
      source: GenreModel,
      target: GenreCategoryModel,
      options: {
        foreignKey: { name: 'genreId' },
        as: 'categoriesId',
      },
    });

    const categoriesRelation = associationsMap.categories;
    expect(categoriesRelation).toMatchObject({
      associationType: 'BelongsToMany',
      source: GenreModel,
      target: CategoryModel,
      options: {
        through: { model: GenreCategoryModel },
        foreignKey: { name: 'genreId' },
        otherKey: { name: 'categoryId' },
        as: 'categories',
      },
    });
  });

  test('create and association relations separately', async () => {
    const categories = Category.fake().theCategories(3).build();
    const categoryRepo = new CategorySequelizeRepository(CategoryModel);
    await categoryRepo.bulkInsert(categories);

    const genreData = {
      genreId: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'test',
      is_active: true,
      createdAt: new Date(),
    };

    const genreModel = await GenreModel.create(genreData);
    await genreModel.$add('categories', [
      categories[0].categoryId.id,
      categories[1].categoryId.id,
      categories[2].categoryId.id,
    ]);

    const genreWithCategories = await GenreModel.findByPk(genreModel.genreId, {
      include: [
        {
          model: CategoryModel,
          attributes: ['categoryId'],
        },
      ],
    });

    expect(genreWithCategories).toMatchObject(genreData);
    expect(genreWithCategories!.categories).toHaveLength(3);
    expect(genreWithCategories!.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          categoryId: categories[0].categoryId.id,
        }),
        expect.objectContaining({
          categoryId: categories[1].categoryId.id,
        }),
        expect.objectContaining({
          categoryId: categories[2].categoryId.id,
        }),
      ]),
    );

    const genreWithCategoriesId = await GenreModel.findByPk(
      genreModel.genreId,
      {
        include: ['categoriesId'],
      },
    );

    expect(genreWithCategoriesId!.categoriesId).toHaveLength(3);
    expect(genreWithCategoriesId!.categoriesId).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          genreId: genreModel.genreId,
          categoryId: categories[0].categoryId.id,
        }),
        expect.objectContaining({
          genreId: genreModel.genreId,
          categoryId: categories[1].categoryId.id,
        }),
        expect.objectContaining({
          genreId: genreModel.genreId,
          categoryId: categories[2].categoryId.id,
        }),
      ]),
    );
  });

  test('create with association in single transaction ', async () => {
    const categories = Category.fake().theCategories(3).build();
    const categoryRepo = new CategorySequelizeRepository(CategoryModel);
    await categoryRepo.bulkInsert(categories);

    const genreModelData = {
      genreId: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'test',
      is_active: true,
      categoriesId: [
        GenreCategoryModel.build({
          categoryId: categories[0].categoryId.id,
          genreId: '9366b7dc-2d71-4799-b91c-c64adb205104',
        }),
        GenreCategoryModel.build({
          categoryId: categories[1].categoryId.id,
          genreId: '9366b7dc-2d71-4799-b91c-c64adb205104',
        }),
        GenreCategoryModel.build({
          categoryId: categories[2].categoryId.id,
          genreId: '9366b7dc-2d71-4799-b91c-c64adb205104',
        }),
      ],
      createdAt: new Date(),
    };
    const genreModel = await GenreModel.create(genreModelData, {
      include: ['categoriesId'],
    });
    const genreWithCategories = await GenreModel.findByPk(genreModel.genreId, {
      include: [
        {
          model: CategoryModel,
          attributes: ['categoryId'],
        },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoriesId, ...genreCommonProps } = genreModelData;
    expect(genreWithCategories).toMatchObject(genreCommonProps);
    expect(genreWithCategories!.categories).toHaveLength(3);
    expect(genreWithCategories!.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          categoryId: categories[0].categoryId.id,
        }),
        expect.objectContaining({
          categoryId: categories[1].categoryId.id,
        }),
        expect.objectContaining({
          categoryId: categories[2].categoryId.id,
        }),
      ]),
    );

    const genreWithCategoriesId = await GenreModel.findByPk(
      genreModel.genreId,
      {
        include: ['categoriesId'],
      },
    );

    expect(genreWithCategoriesId!.categoriesId).toHaveLength(3);
    expect(genreWithCategoriesId!.categoriesId).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          genreId: genreModel.genreId,
          categoryId: categories[0].categoryId.id,
        }),
        expect.objectContaining({
          genreId: genreModel.genreId,
          categoryId: categories[1].categoryId.id,
        }),
        expect.objectContaining({
          genreId: genreModel.genreId,
          categoryId: categories[2].categoryId.id,
        }),
      ]),
    );
  });
});
