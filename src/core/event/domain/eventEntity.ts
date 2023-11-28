import { Entity } from '../../shared/domain/entity';
import { ValueObject } from '../../shared/domain/value-object';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { EventFakeBuilder } from './eventFakeBuilder';
import { EventValidatorFactory } from './eventValidation';

// export type EventConstructorProps = {
//   eventId?: Uuid;
//   name: string;
//   description: string;
//   profileType: string; //arrumar profileType
//   startEvent: Date;
//   finishEvent: Date;
//   localEvent: string;
//   period: string; //arrumar periodo
//   vacancies: number;
//   workload: string;
//   openRegistration: Date;
//   closeRegistration: Date;
//   presence?: boolean;
//   image?: string; //arumar type da imagem
//   createdAt?: Date;
// };

export type EventConstructorProps = {
  eventId?: Uuid;
  name: string;
  description?: string | null;
  is_active?: boolean;
  createdAt?: Date;
};

export type EventCreateCommand = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class Event extends Entity {
  eventId: Uuid;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt: Date;

  constructor(props: EventConstructorProps) {
    super();
    this.eventId = props.eventId ?? new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.createdAt = props.createdAt ?? new Date();
  }

  get entity_id(): ValueObject {
    return this.eventId;
  }

  static create(props: EventCreateCommand): Event {
    const event = new Event(props);
    // event.validate(['name']); //ou valida apena os campos passado
    event.validate(); //valida tudo
    return event;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeDescription(description: string | null): void {
    this.description = description;
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  validate(fields?: string[]) {
    const validator = EventValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return EventFakeBuilder;
  }

  toJSON() {
    return {
      eventId: this.eventId.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      createdAt: this.createdAt,
    };
  }
}
