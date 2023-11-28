import { Controller, Get } from '@nestjs/common';
import { ApiName, AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ApiName {
    return this.appService.getHello();
  }
}
