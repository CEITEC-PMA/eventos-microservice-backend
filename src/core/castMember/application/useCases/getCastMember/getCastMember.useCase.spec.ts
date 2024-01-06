import {
  CastMember,
  CastMemberId,
} from '@core/castMember/domain/castMember.aggregate';
import { CastMemberTypes } from '@core/castMember/domain/castMemberType.vo';
import { CastMemberInMemoryRepository } from '@core/castMember/infra/db/inMemory/castMemberInMemory.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { GetCastMemberUseCase } from './getCastMember.useCase';

describe('GetCastMemberUseCase Unit Tests', () => {
  let useCase: GetCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new GetCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const castMemberId = new CastMemberId();
    await expect(() =>
      useCase.execute({ id: castMemberId.id }),
    ).rejects.toThrow(new NotFoundError(castMemberId.id, CastMember));
  });

  it('should returns a cast member', async () => {
    const items = [CastMember.fake().anActor().build()];
    repository.items = items;
    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: items[0].castMemberId.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].castMemberId.id,
      name: items[0].name,
      type: CastMemberTypes.ACTOR,
      created_at: items[0].createdAt,
    });
  });
});
