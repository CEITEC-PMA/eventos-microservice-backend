import { Event } from '@core/event/domain/eventEntity';
import {
  EventSearchParams,
  EventSearchResult,
  IEventRepository,
} from '@core/event/domain/eventRepository';
import { InvalidArgumentError } from '@core/shared/domain/errors/invalid-argument.error';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { Op, literal } from 'sequelize';
import { EventModel } from './eventModel';
import { EventModelMapper } from './eventModel.mapper';

export class EventSequelizeRepository implements IEventRepository {
  sortableFields: string[] = ['name', 'createdAt'];
  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
    },
  };

  constructor(private eventModel: typeof EventModel) {}

  async insert(entity: Event): Promise<void> {
    const modelProps = EventModelMapper.toModel(entity);
    await this.eventModel.create(modelProps.toJSON());
  }

  async bulkInsert(entities: Event[]): Promise<void> {
    const modelsProps = entities.map((entity) =>
      EventModelMapper.toModel(entity).toJSON(),
    );
    await this.eventModel.bulkCreate(modelsProps);
  }

  async update(entity: Event): Promise<void> {
    const id = entity.eventId.id;

    const modelProps = EventModelMapper.toModel(entity);
    const [affectedRows] = await this.eventModel.update(modelProps.toJSON(), {
      where: { eventId: entity.eventId.id },
    });

    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async delete(eventId: Uuid): Promise<void> {
    const id = eventId.id;

    const affectedRows = await this.eventModel.destroy({
      where: { eventId: id },
    });

    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async findByIds(ids: Uuid[]): Promise<Event[]> {
    const models = await this.eventModel.findAll({
      where: {
        eventId: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
    });
    return models.map((m) => EventModelMapper.toEntity(m));
  }

  async existsById(
    ids: Uuid[],
  ): Promise<{ exists: Uuid[]; not_exists: Uuid[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }

    const existsEventModels = await this.eventModel.findAll({
      attributes: ['eventId'],
      where: {
        eventId: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
    });
    const existsEventIds = existsEventModels.map((m) => new Uuid(m.eventId));
    const notExistsCategoryIds = ids.filter(
      (id) => !existsEventIds.some((e) => e.equals(id)),
    );
    return {
      exists: existsEventIds,
      not_exists: notExistsCategoryIds,
    };
  }

  async findById(entity_id: Uuid): Promise<Event | null> {
    const model = await this.eventModel.findByPk(entity_id.id);

    return model ? EventModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Event[]> {
    const models = await this.eventModel.findAll();
    return models.map((model) => {
      return EventModelMapper.toEntity(model);
    });
  }

  async search(props: EventSearchParams): Promise<EventSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count } = await this.eventModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? //? { order: [[props.sort, props.sort_dir]] }
          { order: this.formatSort(props.sort, props.sort_dir!) }
        : { order: [['createdAt', 'desc']] }),
      offset,
      limit,
    });
    return new EventSearchResult({
      items: models.map((model) => {
        return EventModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.eventModel.sequelize!.getDialect() as 'mysql';
    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }
    return [[sort, sort_dir]];
  }

  getEntity(): new (...args: any[]) => Event {
    return Event;
  }
}
