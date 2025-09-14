import { Injectable, Inject } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { Op } from 'sequelize';
import { OrderStatus } from './entities/order-status.enum';

@Injectable()
export class OrdersRepository {
  constructor(
    @Inject('ORDERS_REPOSITORY')
    private ordersRepository: typeof Order,
  ) {}

  async findActiveOrders(): Promise<Order[]> {
    return this.ordersRepository.findAll<Order>({
      where: {
        status: {
          [Op.not]: OrderStatus.DELIVERED,
        },
      },
    });
  }

  async findOrderById(id: number): Promise<Order | null> {
    return this.ordersRepository.findByPk(id);
  }
}
