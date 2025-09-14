import { Injectable, Inject } from '@nestjs/common';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @Inject('ORDERS_REPOSITORY')
    private ordersRepository: typeof Order,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.findAll<Order>();
  }
}
