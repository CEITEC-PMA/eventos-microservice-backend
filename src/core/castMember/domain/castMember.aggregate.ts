import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import CastMemberValidatorFactory from './castMember.validator';
import { CastMemberFakeBuilder } from './castMemberFake.builder';
import { CastMemberType } from './castMemberType.vo';

export type CastMemberConstructorProps = {
  castMemberId?: CastMemberId;
  name: string;
  type: CastMemberType;
  createdAt?: Date;
};

export type CastMemberCreateCommand = {
  name: string;
  type: CastMemberType;
};

export class CastMemberId extends Uuid {}

export class CastMember extends AggregateRoot {
  castMemberId: CastMemberId;
  name: string;
  type: CastMemberType;
  createdAt: Date;

  constructor(props: CastMemberConstructorProps) {
    super();
    this.castMemberId = props.castMemberId ?? new CastMemberId();
    this.name = props.name;
    this.type = props.type;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: CastMemberCreateCommand) {
    const castMember = new CastMember(props);
    castMember.validate(['name']);
    return castMember;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeType(type: CastMemberType): void {
    this.type = type;
  }

  validate(fields?: string[]) {
    const validator = CastMemberValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return CastMemberFakeBuilder;
  }

  get entity_id() {
    return this.castMemberId;
  }

  toJSON() {
    return {
      castMemberId: this.castMemberId.id,
      name: this.name,
      type: this.type.type,
      createdAt: this.createdAt,
    };
  }
}
