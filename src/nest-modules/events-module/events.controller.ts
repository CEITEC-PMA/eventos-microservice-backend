import { EventOutput } from '@core/event/application/commom/eventOutput';
import { CreateEventUseCase } from '@core/event/application/createEvent/createEventUseCase';
import { DeleteEventUseCase } from '@core/event/application/deleteEvent/deleteEventUseCase';
import { GetEventUseCase } from '@core/event/application/getEvent/getEventUseCase';
import { ListEventsUseCase } from '@core/event/application/listEvent/listEventsUseCase';
import { UpdateEventUseCase } from '@core/event/application/updateEvent/updateEventUseCase';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { SearchEventsDto } from './dto/search-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventCollectionPresenter, EventPresenter } from './events.presenter';

@Controller('events')
export class EventsController {
  @Inject(CreateEventUseCase)
  private createUseCase: CreateEventUseCase;

  @Inject(UpdateEventUseCase)
  private updateUseCase: UpdateEventUseCase;

  @Inject(DeleteEventUseCase)
  private deleteUseCase: DeleteEventUseCase;

  @Inject(GetEventUseCase)
  private getUseCase: GetEventUseCase;

  @Inject(ListEventsUseCase)
  private listUseCase: ListEventsUseCase;

  //POST
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const output = await this.createUseCase.execute(createEventDto);
    return EventsController.serialize(output);
  }

  //GETALL
  @Get()
  async search(@Query() searchParamsDto: SearchEventsDto) {
    const output = await this.listUseCase.execute(searchParamsDto);
    return new EventCollectionPresenter(output);
  }

  //GET
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });
    return EventsController.serialize(output);
  }

  //UPDATE
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const output = await this.updateUseCase.execute({ ...updateEventDto, id });
    return EventsController.serialize(output);
  }

  //DELETE
  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return this.deleteUseCase.execute({ id });
  }

  static serialize(output: EventOutput) {
    return new EventPresenter(output);
  }
}
