import { CastMemberId } from '@core/castMember/domain/castMember.aggregate';
import { CastMemberTypes } from '@core/castMember/domain/castMemberType.vo';
import {
  CastMemberModel,
  CastMemberSequelizeRepository,
} from '@core/castMember/infra/db/sequelize/castMemberSequelize';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CreateCastMemberUseCase } from './createCastMember.useCase';

describe('CreateCastMemberUseCase Integration Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new CreateCastMemberUseCase(repository);
  });

  it('should create a cast member', async () => {
    let output = await useCase.execute({
      name: 'test',
      type: CastMemberTypes.ACTOR,
    });
    let entity = await repository.findById(new CastMemberId(output.id));
    expect(output).toStrictEqual({
      id: entity!.castMemberId.id,
      name: 'test',
      type: CastMemberTypes.ACTOR,
      created_at: entity!.createdAt,
    });

    output = await useCase.execute({
      name: 'test',
      type: CastMemberTypes.DIRECTOR,
    });
    entity = await repository.findById(new CastMemberId(output.id));
    expect(output).toStrictEqual({
      id: entity!.castMemberId.id,
      name: 'test',
      type: CastMemberTypes.DIRECTOR,
      created_at: entity!.createdAt,
    });
  });
});
