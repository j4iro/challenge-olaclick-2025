import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  findAll(): Promise<any[]> {
    return this.ordersRepository.findAll();
  }
}
