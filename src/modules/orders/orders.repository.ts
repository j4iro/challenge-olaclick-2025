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
      include: [OrderItems],
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'clientName', 'status', 'createdAt'],
    });
  }

  async findOrderById(
    id: number,
    { includeItems = false }: { includeItems?: boolean } = {},
  ): Promise<Order | null> {
    return this.ordersRepository.findByPk(id, {
      include: includeItems ? [OrderItems] : [],
    });
  }

  async createOrder(order: {
    clientName: string;
    items: Array<{ description: string; quantity: number; unitPrice: number }>;
  }): Promise<Order> {
    return this.ordersRepository.create(order, {
      include: [OrderItems],
    });
  }

  async updateStatus(id: number, status: OrderStatus): Promise<any> {
    return this.ordersRepository.update(
      { status },
      { where: { id }, returning: true },
    );
  }

  async deleteOrder(id: number): Promise<number> {
    return this.ordersRepository.destroy({
      where: { id },
    });
  }
}
