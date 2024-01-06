import { CategoryId } from '@core/category/domain/category.aggregate';
import { Genre, GenreId } from './genre.aggregate';

describe('Genre Unit Tests', () => {
  beforeEach(() => {
    Genre.prototype.validate = jest
      .fn()
      .mockImplementation(Genre.prototype.validate);
  });
  test('constructor of genre', () => {
    const categoryId = new CategoryId();
    const categoriesId = new Map([[categoryId.id, categoryId]]);
    let genre = new Genre({
      name: 'test',
      categoriesId: categoriesId,
    });
    expect(genre.genreId).toBeInstanceOf(GenreId);
    expect(genre.name).toBe('test');
    expect(genre.categoriesId).toEqual(categoriesId);
    expect(genre.is_active).toBe(true);
    expect(genre.createdAt).toBeInstanceOf(Date);

    const createdAt = new Date();
    genre = new Genre({
      name: 'test',
      categoriesId: categoriesId,
      is_active: false,
      createdAt,
    });
    expect(genre.genreId).toBeInstanceOf(GenreId);
    expect(genre.name).toBe('test');
    expect(genre.categoriesId).toEqual(categoriesId);
    expect(genre.is_active).toBe(false);
    expect(genre.createdAt).toBe(createdAt);
  });

  describe('genreId field', () => {
    const categoryId = new CategoryId();
    const categoriesId = new Map<string, CategoryId>([
      [categoryId.id, categoryId],
    ]);
    const arrange = [
      { name: 'Movie', categoriesId },
      { name: 'Movie', categoriesId, id: null },
      { name: 'Movie', categoriesId, id: undefined },
      { name: 'Movie', categoriesId, id: new GenreId() },
    ];

    test.each(arrange)('when props is %j', (item) => {
      const genre = new Genre(item);
      expect(genre.genreId).toBeInstanceOf(GenreId);
    });
  });

  describe('create command', () => {
    test('should create a genre', () => {
      const categoryId = new CategoryId();
      const categoriesId = new Map([[categoryId.id, categoryId]]);
      const genre = Genre.create({
        name: 'test',
        categoriesId: [categoryId],
      });
      expect(genre.genreId).toBeInstanceOf(GenreId);
      expect(genre.name).toBe('test');
      expect(genre.categoriesId).toEqual(categoriesId);
      expect(genre.createdAt).toBeInstanceOf(Date);
      expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);

      const genre2 = Genre.create({
        name: 'test',
        categoriesId: [categoryId],
        is_active: false,
      });
      expect(genre2.genreId).toBeInstanceOf(GenreId);
      expect(genre2.name).toBe('test');
      expect(genre2.categoriesId).toEqual(categoriesId);
      expect(genre2.is_active).toBe(false);
      expect(genre2.createdAt).toBeInstanceOf(Date);
    });
  });

  test('should change name', () => {
    const genre = Genre.create({
      name: 'test',
      categoriesId: [new CategoryId()],
    });
    genre.changeName('test2');
    expect(genre.name).toBe('test2');
    expect(Genre.prototype.validate).toHaveBeenCalledTimes(2);
  });

  test('should add category id', () => {
    const categoryId = new CategoryId();
    const genre = Genre.create({
      name: 'test',
      categoriesId: [categoryId],
    });
    genre.addCategoryId(categoryId);
    expect(genre.categoriesId.size).toBe(1);
    expect(genre.categoriesId).toEqual(new Map([[categoryId.id, categoryId]]));
    expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);

    const categoryId2 = new CategoryId();
    genre.addCategoryId(categoryId2);
    expect(genre.categoriesId.size).toBe(2);
    expect(genre.categoriesId).toEqual(
      new Map([
        [categoryId.id, categoryId],
        [categoryId2.id, categoryId2],
      ]),
    );
    expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);
  });
});

describe('Genre Validator', () => {
  describe('create command', () => {
    test('should an invalid genre with name property', () => {
      const categoryId = new CategoryId();
      const genre = Genre.create({
        name: 't'.repeat(256),
        categoriesId: [categoryId],
      } as any);
      expect(genre.notification.hasErrors()).toBe(true);
      expect(genre.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
  describe('changeName method', () => {
    it('should a invalid genre using name property', () => {
      const genre = Genre.fake().aGenre().build();
      genre.changeName('t'.repeat(256));
      expect(genre.notification.hasErrors()).toBe(true);
      expect(genre.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
