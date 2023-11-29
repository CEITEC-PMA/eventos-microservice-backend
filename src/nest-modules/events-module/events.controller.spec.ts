import { CreateEventOutput } from '@core/event/application/createEvent/createEvent.useCase';
import { GetEventOutput } from '@core/event/application/getEvent/getEvent.useCase';
import { ListEventsOutput } from '@core/event/application/listEvent/listEvents.useCase';
import { UpdateEventInput } from '@core/event/application/updateEvent/updateEvent.input';
import { UpdateEventOutput } from '@core/event/application/updateEvent/updateEvent.useCase';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsController } from './events.controller';
import { EventCollectionPresenter, EventPresenter } from './events.presenter';

describe('EventsController Unit Tests', () => {
  let controller: EventsController;

  beforeEach(async () => {
    controller = new EventsController();
  });

  it('should creates a EVENT', async () => {
    //Arrange
    const output: CreateEventOutput = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      createdAt: new Date(),
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateEventDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    //Act
    const presenter = await controller.create(input);

    //Assert
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(EventPresenter);
    expect(presenter).toStrictEqual(new EventPresenter(output));
  });

  it('should updates a EVENT', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: UpdateEventOutput = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      createdAt: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: Omit<UpdateEventInput, 'id'> = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(EventPresenter);
    expect(presenter).toStrictEqual(new EventPresenter(output));
  });

  it('should deletes a EVENT', async () => {
    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should gets a EVENT', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GetEventOutput = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      createdAt: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(EventPresenter);
    expect(presenter).toStrictEqual(new EventPresenter(output));
  });

  it('should list EVENTS', async () => {
    const output: ListEventsOutput = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          description: 'some description',
          is_active: true,
          createdAt: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(EventCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new EventCollectionPresenter(output));
  });
});
