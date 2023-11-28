import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { DataType } from 'sequelize-typescript';
import { EventModel } from './eventModel';

describe('EventModel Integration Tests', () => {
  setupSequelize({ models: [EventModel] });

  test('mapping props', () => {
    const attributesMap = EventModel.getAttributes();
    const attributes = Object.keys(EventModel.getAttributes());

    expect(attributes).toStrictEqual([
      'eventId',
      'name',
      'description',
      'is_active',
      'createdAt',
    ]);

    const categoryIdAttr = attributesMap.eventId;
    expect(categoryIdAttr).toMatchObject({
      field: 'eventId',
      fieldName: 'eventId',
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

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT(),
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
      type: DataType.DATE(3),
    });
  });

  test('create', async () => {
    //arrange
    const arrange = {
      eventId: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'test',
      is_active: true,
      createdAt: new Date(),
    };

    //act
    const category = await EventModel.create(arrange);

    //assert
    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
