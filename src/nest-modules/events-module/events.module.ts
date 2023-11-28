import { EventModel } from '@core/event/infra/db/sequelize/eventModel';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventsController } from './events.controller';
import { EVENT_PROVIDERS } from './events.providers';

@Module({
  imports: [SequelizeModule.forFeature([EventModel])],
  controllers: [EventsController],
  providers: [
    ...Object.values(EVENT_PROVIDERS.REPOSITORIES),
    ...Object.values(EVENT_PROVIDERS.USE_CASES),
  ],
})
export class EventsModule {}
