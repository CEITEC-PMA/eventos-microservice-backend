import {
  CastMember,
  CastMemberId,
} from '@core/castMember/domain/castMember.aggregate';
import {
  CastMemberModel,
  CastMemberSequelizeRepository,
} from '@core/castMember/infra/db/sequelize/castMemberSequelize';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { GetCastMemberUseCase } from './getCastMember.useCase';

describe('GetCastMemberUseCase Integration Tests', () => {
  let useCase: GetCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new GetCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const castMemberId = new CastMemberId();
    await expect(() =>
      useCase.execute({ id: castMemberId.id }),
    ).rejects.toThrow(new NotFoundError(castMemberId.id, CastMember));
  });

  it('should returns a cast member', async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);
    const output = await useCase.execute({ id: castMember.castMemberId.id });
    expect(output).toStrictEqual({
      id: castMember.castMemberId.id,
      name: castMember.name,
      type: castMember.type.type,
      created_at: castMember.createdAt,
    });
  });
});
