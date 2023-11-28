import { EventModel } from '@core/event/infra/db/sequelize/eventModel';
import { EventSequelizeRepository } from '@core/event/infra/db/sequelize/eventSequelizeRepository';
import { Module } from '@nestjs/common';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { EventsController } from './events.controller';

@Module({
  imports: [SequelizeModule.forFeature([EventModel])],
  controllers: [EventsController],
  providers: [
    {
      provide: EventSequelizeRepository,
      useFactory: (eventModel: typeof EventModel) =>
        new EventSequelizeRepository(eventModel),
      inject: [getModelToken(EventModel)],
    },
  ],
})
export class EventsModule {}
