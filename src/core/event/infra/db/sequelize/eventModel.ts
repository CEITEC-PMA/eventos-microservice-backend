import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export type EventModelProps = {
  eventId: string;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt: Date;
};

@Table({ tableName: 'events', timestamps: false })
export class EventModel extends Model<EventModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare eventId: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  declare description: string | null;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_active: boolean;

  @Column({ allowNull: false, type: DataType.DATE(3) })
  declare createdAt: Date;
}
