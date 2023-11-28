import { IEventRepository } from '@core/event/domain/eventRepository';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';

export class DeleteEventUseCase
  implements IUseCase<DeleteEventInput, DeleteEventOutput>
{
  constructor(private eventRepo: IEventRepository) {}

  async execute(input: DeleteEventInput): Promise<DeleteEventOutput> {
    const categoryId = new Uuid(input.id);
    await this.eventRepo.delete(categoryId);
  }
}

export type DeleteEventInput = {
  id: string;
};

type DeleteEventOutput = void;
