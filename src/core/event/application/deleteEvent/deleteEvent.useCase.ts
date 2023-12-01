import { EventId } from '@core/event/domain/eventEntity.aggregate';
import { IEventRepository } from '@core/event/domain/eventRepository';
import { IUseCase } from '@core/shared/application/use-case.interface';

export class DeleteEventUseCase
  implements IUseCase<DeleteEventInput, DeleteEventOutput>
{
  constructor(private eventRepo: IEventRepository) {}

  async execute(input: DeleteEventInput): Promise<DeleteEventOutput> {
    const categoryId = new EventId(input.id);
    await this.eventRepo.delete(categoryId);
  }
}

export type DeleteEventInput = {
  id: string;
};

type DeleteEventOutput = void;
