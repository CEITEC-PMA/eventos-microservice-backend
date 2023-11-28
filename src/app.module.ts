import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { EventsModule } from './nest-modules/events-module/events.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, EventsModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
