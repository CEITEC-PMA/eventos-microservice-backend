import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export type GenreModelProps = {
  genreId: string;
  name: string;
  is_active: boolean;
  createdAt: Date;
};

@Table({ tableName: 'genres', timestamps: false })
export class GenreModel extends Model<GenreModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare genreId: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @HasMany(() => GenreCategoryModel, 'genreId')
  declare categoriesId: GenreCategoryModel[];

  @BelongsToMany(() => CategoryModel, () => GenreCategoryModel)
  declare categories: CategoryModel[];

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_active: boolean;

  @Column({ allowNull: false, type: DataType.DATE(6) })
  declare createdAt: Date;
}

export type GenreCategoryModelProps = {
  genreId: string;
  categoryId: string;
};

@Table({ tableName: 'category_genre', timestamps: false })
export class GenreCategoryModel extends Model<GenreCategoryModelProps> {
  @PrimaryKey
  @ForeignKey(() => GenreModel)
  @Column({ type: DataType.UUID })
  declare genreId: string;

  @PrimaryKey
  @ForeignKey(() => CategoryModel)
  @Column({ type: DataType.UUID })
  declare categoryId: string;
}
