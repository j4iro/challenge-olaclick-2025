import { Table, Column, Model, Default } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { OrderStatus } from './order-status.enum';

@Table
export class Order extends Model {
  @Column
  clientName: string;

  /*
  @Column
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  */

  @Default(OrderStatus.INITIATED)
  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
  })
  status: OrderStatus;
}
