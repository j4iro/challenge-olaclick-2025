import { Table, Column, Model } from 'sequelize-typescript';

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

  @Column
  status: string;
}
