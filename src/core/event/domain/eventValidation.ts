import { Notification } from '@core/shared/domain/validators/notification';
import { MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Event } from './eventEntity.aggregate';

class EventRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor(props: Event) {
    Object.assign(this, props);
  }
}

export class EventValidation extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['name'];
    return super.validate(notification, new EventRules(data), newFields);
  }
}

export class EventValidatorFactory {
  static create() {
    return new EventValidation();
  }
}
