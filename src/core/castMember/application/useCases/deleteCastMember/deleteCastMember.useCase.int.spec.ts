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
import { DeleteCastMemberUseCase } from './deleteCastMember.useCase';

describe('DeleteCastMemberUseCase Integration Tests', () => {
  let useCase: DeleteCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new DeleteCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const castMemberId = new CastMemberId();
    await expect(() =>
      useCase.execute({ id: castMemberId.id }),
    ).rejects.toThrow(new NotFoundError(castMemberId.id, CastMember));
  });

  it('should delete a cast member', async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);
    await useCase.execute({
      id: castMember.castMemberId.id,
    });
    const noHasModel = await CastMemberModel.findByPk(
      castMember.castMemberId.id,
    );
    expect(noHasModel).toBeNull();
  });
});
