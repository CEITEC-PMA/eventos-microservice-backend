import { EventSequelizeRepository } from '@core/event/infra/db/sequelize/eventSequelizeRepository';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private eventRepo: EventSequelizeRepository) {
    console.log(this.eventRepo);
  }

  @Post()
  create(@Body() createEventDto: CreateEventDto) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
