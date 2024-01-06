import {
  CastMember,
  CastMemberId,
} from '@core/castMember/domain/castMember.aggregate';
import { CastMemberInMemoryRepository } from '@core/castMember/infra/db/inMemory/castMemberInMemory.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { DeleteCastMemberUseCase } from './deleteCastMember.useCase';

describe('DeleteCastMemberUseCase Unit Tests', () => {
  let useCase: DeleteCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new DeleteCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const castMemberId = new CastMemberId();

    await expect(() =>
      useCase.execute({ id: castMemberId.id }),
    ).rejects.toThrow(new NotFoundError(castMemberId.id, CastMember));
  });

  it('should delete a cast member', async () => {
    const items = [CastMember.fake().anActor().build()];
    repository.items = items;
    await useCase.execute({
      id: items[0].castMemberId.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
