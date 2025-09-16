import { Table, Column, Model, Default, HasMany } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { OrderStatus } from './order-status.enum';
import { OrderItems } from './order-items.entity';

@Table
export class Order extends Model {
  @Column
  clientName: string;

  @Default(OrderStatus.INITIATED)
  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
  })
  status: OrderStatus;

  @HasMany(() => OrderItems, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  items: OrderItems[];
}
