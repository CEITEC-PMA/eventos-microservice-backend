import { CastMember } from '@core/castMember/domain/castMember.aggregate';
import { CastMemberType } from '@core/castMember/domain/castMemberType.vo';
import { CastMemberOutputMapper } from './castMember.output';

describe('CastMemberOutputMapper Unit Tests', () => {
  it('should convert a cast member in output', () => {
    const entity = CastMember.create({
      name: 'Movie',
      type: CastMemberType.createAnActor(),
    });
    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = CastMemberOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.castMemberId.id,
      name: 'Movie',
      type: CastMemberType.createAnActor().type,
      created_at: entity.createdAt,
    });
  });
});
