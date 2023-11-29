import { CreateEventUseCase } from '@core/event/application/createEvent/createEvent.useCase';
import { DeleteEventUseCase } from '@core/event/application/deleteEvent/deleteEvent.useCase';
import { GetEventUseCase } from '@core/event/application/getEvent/getEvent.useCase';
import { ListEventsUseCase } from '@core/event/application/listEvent/listEvents.useCase';
import { UpdateEventUseCase } from '@core/event/application/updateEvent/updateEvent.useCase';
import { IEventRepository } from '@core/event/domain/eventRepository';
import { EventInMemoryRepository } from '@core/event/infra/db/inMemory/eventInMemory.repository';
import { EventModel } from '@core/event/infra/db/sequelize/eventModel';
import { EventSequelizeRepository } from '@core/event/infra/db/sequelize/eventSequelize.repository';
import { getModelToken } from '@nestjs/sequelize';

export const REPOSITORIES = {
  EVENT_REPOSITORY: {
    provide: 'EventRepository',
    useExisting: EventSequelizeRepository,
  },
  EVENT_IN_MEMORY_REPOSITORY: {
    provide: EventInMemoryRepository,
    useClass: EventInMemoryRepository,
  },
  EVENT_SEQUELIZE_REPOSITORY: {
    provide: EventSequelizeRepository,
    useFactory: (categoryModel: typeof EventModel) => {
      return new EventSequelizeRepository(categoryModel);
    },
    inject: [getModelToken(EventModel)],
  },
};

export const USE_CASES = {
  CREATE_EVENT_USE_CASE: {
    provide: CreateEventUseCase,
    useFactory: (eventRepo: IEventRepository) => {
      return new CreateEventUseCase(eventRepo);
    },
    inject: [REPOSITORIES.EVENT_REPOSITORY.provide],
  },
  UPDATE_EVENT_USE_CASE: {
    provide: UpdateEventUseCase,
    useFactory: (eventRepo: IEventRepository) => {
      return new UpdateEventUseCase(eventRepo);
    },
    inject: [REPOSITORIES.EVENT_REPOSITORY.provide],
  },
  LIST_EVENT_USE_CASE: {
    provide: ListEventsUseCase,
    useFactory: (eventRepo: IEventRepository) => {
      return new ListEventsUseCase(eventRepo);
    },
    inject: [REPOSITORIES.EVENT_REPOSITORY.provide],
  },
  GET_EVENT_USE_CASE: {
    provide: GetEventUseCase,
    useFactory: (eventRepo: IEventRepository) => {
      return new GetEventUseCase(eventRepo);
    },
    inject: [REPOSITORIES.EVENT_REPOSITORY.provide],
  },
  DELETE_EVENT_USE_CASE: {
    provide: DeleteEventUseCase,
    useFactory: (categoryRepo: IEventRepository) => {
      return new DeleteEventUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.EVENT_REPOSITORY.provide],
  },
};

// export const VALIDATIONS = {
//   EVENT_IDS_EXISTS_IN_DATABASE_VALIDATOR: {
//     provide: CategoriesIdExistsInDatabaseValidator,
//     useFactory: (categoryRepo: ICategoryRepository) => {
//       return new CategoriesIdExistsInDatabaseValidator(categoryRepo);
//     },
//     inject: [REPOSITORIES.EVENT_REPOSITORY.provide],
//   },
// };

export const EVENT_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  //   VALIDATIONS,
};
