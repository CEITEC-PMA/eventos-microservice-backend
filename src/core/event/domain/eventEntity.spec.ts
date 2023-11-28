import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Event } from './eventEntity';

describe('Event Unit Tests', () => {
  beforeEach(() => {
    Event.prototype.validate = jest
      .fn()
      .mockImplementation(Event.prototype.validate);
  });
  test('constructor of event', () => {
    let event = new Event({ name: 'Movie' });

    expect(event.eventId).toBeInstanceOf(Uuid);
    expect(event.name).toBe('Movie');
    expect(event.description).toBeNull();
    expect(event.is_active).toBe(true);
    expect(event.createdAt).toBeInstanceOf(Date);

    let createdAt = new Date();
    event = new Event({
      name: 'Movie',
      description: 'some description',
      is_active: false,
      createdAt,
    });
    expect(event.eventId).toBeInstanceOf(Uuid);
    expect(event.name).toBe('Movie');
    expect(event.description).toBe('some description');
    expect(event.is_active).toBe(false);
    expect(event.createdAt).toBe(createdAt);

    event = new Event({
      name: 'Movie',
      description: 'other description',
    });
    expect(event.eventId).toBeInstanceOf(Uuid);
    expect(event.name).toBe('Movie');
    expect(event.description).toBe('other description');
    expect(event.is_active).toBe(true);
    expect(event.createdAt).toBeInstanceOf(Date);

    event = new Event({
      name: 'Movie',
      is_active: true,
    });
    expect(event.eventId).toBeInstanceOf(Uuid);
    expect(event.name).toBe('Movie');
    expect(event.description).toBeNull();
    expect(event.is_active).toBe(true);
    expect(event.createdAt).toBeInstanceOf(Date);

    createdAt = new Date();
    event = new Event({
      name: 'Movie',
      createdAt,
    });
    expect(event.eventId).toBeInstanceOf(Uuid);
    expect(event.name).toBe('Movie');
    expect(event.description).toBeNull();
    expect(event.is_active).toBe(true);
    expect(event.createdAt).toBe(createdAt);
  });

  describe('Create command', () => {
    test('should create a EVENT', () => {
      const event = Event.create({
        name: 'Movie',
      });
      expect(event.eventId).toBeInstanceOf(Uuid);
      expect(event.name).toBe('Movie');
      expect(event.description).toBeNull();
      expect(event.is_active).toBe(true);
      expect(event.createdAt).toBeInstanceOf(Date);
      expect(Event.prototype.validate).toHaveBeenCalledTimes(1);
      expect(event.notification.hasErrors()).toBe(false);
    });

    test('should create a EVENT with description', () => {
      const event = Event.create({
        name: 'Movie',
        description: 'some description',
      });
      expect(event.eventId).toBeInstanceOf(Uuid);
      expect(event.name).toBe('Movie');
      expect(event.description).toBe('some description');
      expect(event.is_active).toBe(true);
      expect(event.createdAt).toBeInstanceOf(Date);
      expect(Event.prototype.validate).toHaveBeenCalledTimes(1);
      expect(event.notification.hasErrors()).toBe(false);
    });

    test('should create a EVENT with is_active', () => {
      const event = Event.create({
        name: 'Movie',
        is_active: false,
      });
      expect(event.eventId).toBeInstanceOf(Uuid);
      expect(event.name).toBe('Movie');
      expect(event.description).toBeNull();
      expect(event.is_active).toBe(false);
      expect(event.createdAt).toBeInstanceOf(Date);
      expect(Event.prototype.validate).toHaveBeenCalledTimes(1);
      expect(event.notification.hasErrors()).toBe(false);
    });
  });

  describe('eventId field', () => {
    const arrange = [{ id: null }, { id: undefined }, { id: new Uuid() }];

    test.each(arrange)('should be is %j', (props) => {
      const event = new Event(props as any);
      expect(event.eventId).toBeInstanceOf(Uuid);
    });
  });

  test('should change name', () => {
    const event = new Event({
      name: 'Movie',
    });
    event.changeName('other name');
    expect(event.name).toBe('other name');
    expect(Event.prototype.validate).toHaveBeenCalledTimes(1);
    expect(event.notification.hasErrors()).toBe(false);
  });

  test('should change description', () => {
    const event = new Event({
      name: 'Movie',
    });
    event.changeDescription('some description');
    expect(event.description).toBe('some description');
    expect(event.notification.hasErrors()).toBe(false);
  });

  test('should active a category', () => {
    const event = new Event({
      name: 'Filmes',
      is_active: false,
    });
    event.activate();
    expect(event.is_active).toBe(true);
    expect(event.notification.hasErrors()).toBe(false);
  });

  test('should disable a category', () => {
    const event = new Event({
      name: 'Filmes',
      is_active: true,
    });
    event.deactivate();
    expect(event.is_active).toBe(false);
    expect(event.notification.hasErrors()).toBe(false);
  });
});

describe('Event Validator', () => {
  describe('create command', () => {
    test('should an invalid Event with name property', () => {
      const event = Event.create({ name: 't'.repeat(256) });

      expect(event.notification.hasErrors()).toBe(true);
      expect(event.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    it('should a invalid EVENT using name property', () => {
      const event = Event.create({ name: 'Movie' });
      event.changeName('t'.repeat(256));
      expect(event.notification.hasErrors()).toBe(true);
      expect(event.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
