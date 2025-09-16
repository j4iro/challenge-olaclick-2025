import { Injectable, Inject } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderItems } from './entities/order-items.entity';
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

  async createOrder(order: {
    clientName: string;
    items: Array<{ description: string; quantity: number; unitPrice: number }>;
  }): Promise<Order> {
    return this.ordersRepository.create(order, {
      include: [OrderItems],
    });
  }
}
