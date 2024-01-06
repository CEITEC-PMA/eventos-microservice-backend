import { CastMember } from '@core/castMember/domain/castMember.aggregate';

export type CastMemberOutput = {
  id: string;
  name: string;
  type: number;
  createdAt: Date;
};

export class CastMemberOutputMapper {
  static toOutput(entity: CastMember): CastMemberOutput {
    const { castMemberId, ...other_props } = entity.toJSON();
    return {
      id: castMemberId,
      ...other_props,
    };
  }
}
