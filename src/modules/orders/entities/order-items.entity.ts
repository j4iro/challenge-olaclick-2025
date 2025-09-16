import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Order } from './order.entity';

@Table
export class OrderItems extends Model {
  @Column
  description: string;

  @Column
  quantity: number;

  @Column
  unitPrice: number;

  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;
}
