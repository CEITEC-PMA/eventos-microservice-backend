import { EventOutput } from '@core/event/application/commom/eventOutput';
import { ListEventsOutput } from '@core/event/application/listEvent/listEventsUseCase';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../shared-module/collection.presenter';

export class EventPresenter {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: EventOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.is_active = output.is_active;
    this.createdAt = output.createdAt;
  }
}

export class EventCollectionPresenter extends CollectionPresenter {
  data: EventPresenter[];

  constructor(output: ListEventsOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((i) => new EventPresenter(i));
  }
}
