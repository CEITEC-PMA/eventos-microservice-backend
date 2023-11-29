import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { Chance } from 'chance';
import { EventFakeBuilder } from './eventFake.builder';

describe('EventFakerBuilder Unit Tests', () => {
  describe('eventId prop', () => {
    const faker = EventFakeBuilder.aEvent();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.eventId).toThrow(
        new Error("Property eventId not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_eventId']).toBeUndefined();
    });

    test('withEventId', () => {
      const eventId = new Uuid();
      const $this = faker.withEventId(eventId);
      expect($this).toBeInstanceOf(EventFakeBuilder);
      expect(faker['_eventId']).toBe(eventId);

      faker.withEventId(() => eventId);
      //@ts-expect-error _eventId is a callable
      expect(faker['_eventId']()).toBe(eventId);

      expect(faker.eventId).toBe(eventId);
    });

    //TODO - melhorar este nome
    test('should pass index to eventId factory', () => {
      let mockFactory = jest.fn(() => new Uuid());
      faker.withEventId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const eventId = new Uuid();
      mockFactory = jest.fn(() => eventId);
      const fakerMany = EventFakeBuilder.theEvents(2);
      fakerMany.withEventId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].eventId).toBe(eventId);
      expect(fakerMany.build()[1].eventId).toBe(eventId);
    });
  });

  describe('name prop', () => {
    const faker = EventFakeBuilder.aEvent();
    test('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(EventFakeBuilder);
      expect(faker['_name']).toBe('test name');

      faker.withName(() => 'test name');
      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe('test name');

      expect(faker.name).toBe('test name');
    });

    test('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      const event = faker.build();
      expect(event.name).toBe(`test name 0`);

      const fakerMany = EventFakeBuilder.theEvents(2);
      fakerMany.withName((index) => `test name ${index}`);
      const events = fakerMany.build();

      expect(events[0].name).toBe(`test name 0`);
      expect(events[1].name).toBe(`test name 1`);
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(EventFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name'].length).toBe(256);
      expect(faker['_name']).toBe(tooLong);
    });
  });

  describe('description prop', () => {
    const faker = EventFakeBuilder.aEvent();
    test('should be a function', () => {
      expect(typeof faker['_description']).toBe('function');
    });

    test('should call the paragraph method', () => {
      const chance = Chance();
      const spyParagraphMethod = jest.spyOn(chance, 'paragraph');
      faker['chance'] = chance;
      faker.build();
      expect(spyParagraphMethod).toHaveBeenCalled();
    });

    test('withDescription', () => {
      const $this = faker.withDescription('test description');
      expect($this).toBeInstanceOf(EventFakeBuilder);
      expect(faker['_description']).toBe('test description');

      faker.withDescription(() => 'test description');
      //@ts-expect-error description is callable
      expect(faker['_description']()).toBe('test description');

      expect(faker.description).toBe('test description');
    });

    test('should pass index to description factory', () => {
      faker.withDescription((index) => `test description ${index}`);
      const category = faker.build();
      expect(category.description).toBe(`test description 0`);

      const fakerMany = EventFakeBuilder.theEvents(2);
      fakerMany.withDescription((index) => `test description ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].description).toBe(`test description 0`);
      expect(categories[1].description).toBe(`test description 1`);
    });
  });

  describe('is_active prop', () => {
    const faker = EventFakeBuilder.aEvent();
    test('should be a function', () => {
      expect(typeof faker['_is_active']).toBe('function');
    });

    test('activate', () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(EventFakeBuilder);
      expect(faker['_is_active']).toBe(true);
      expect(faker.is_active).toBe(true);
    });

    test('deactivate', () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(EventFakeBuilder);
      expect(faker['_is_active']).toBe(false);
      expect(faker.is_active).toBe(false);
    });
  });

  describe('createdAt prop', () => {
    const faker = EventFakeBuilder.aEvent();

    test('should throw error when any with methods has called', () => {
      const fakerCategory = EventFakeBuilder.aEvent();
      expect(() => fakerCategory.createdAt).toThrowError(
        new Error("Property createdAt not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_createdAt']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(EventFakeBuilder);
      expect(faker['_createdAt']).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _createdAt is a callable
      expect(faker['_createdAt']()).toBe(date);
      expect(faker.createdAt).toBe(date);
    });

    test('should pass index to createdAt factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.createdAt.getTime()).toBe(date.getTime() + 2);

      const fakerMany = EventFakeBuilder.theEvents(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].createdAt.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].createdAt.getTime()).toBe(date.getTime() + 3);
    });
  });

  test('should create a Event', () => {
    const faker = EventFakeBuilder.aEvent();
    let event = faker.build();

    expect(event.eventId).toBeInstanceOf(Uuid);
    expect(typeof event.name === 'string').toBeTruthy();
    expect(typeof event.description === 'string').toBeTruthy();
    expect(event.is_active).toBe(true);
    expect(event.createdAt).toBeInstanceOf(Date);

    const createdAt = new Date();
    const eventId = new Uuid();
    event = faker
      .withEventId(eventId)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(createdAt)
      .build();

    expect(event.eventId.id).toBe(eventId.id);
    expect(event.name).toBe('name test');
    expect(event.description).toBe('description test');
    expect(event.is_active).toBe(false);
    expect(event.createdAt).toBe(createdAt);
  });

  test('should create many Events', () => {
    const faker = EventFakeBuilder.theEvents(2);
    let events = faker.build();

    events.forEach((event) => {
      expect(event.eventId).toBeInstanceOf(Uuid);
      expect(typeof event.name === 'string').toBeTruthy();
      expect(typeof event.description === 'string').toBeTruthy();
      expect(event.is_active).toBe(true);
      expect(event.createdAt).toBeInstanceOf(Date);
    });

    const createdAt = new Date();
    const eventId = new Uuid();
    events = faker
      .withEventId(eventId)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(createdAt)
      .build();

    events.forEach((event) => {
      expect(event.eventId.id).toBe(eventId.id);
      expect(event.name).toBe('name test');
      expect(event.description).toBe('description test');
      expect(event.is_active).toBe(false);
      expect(event.createdAt).toBe(createdAt);
    });
  });
});
