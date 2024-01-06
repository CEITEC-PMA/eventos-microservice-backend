import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CastMembersModule } from './nest-modules/castMembers-module/cast-members.module';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { MigrationsModule } from './nest-modules/database-module/migrations.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    SharedModule,
    MigrationsModule,
    CategoriesModule,
    CastMembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
