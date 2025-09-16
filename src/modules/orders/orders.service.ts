import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  findActiveOrders(): Promise<Order[]> {
    return this.ordersRepository.findActiveOrders();
  }

  findOrderById(id: number): Promise<Order | null> {
    return this.ordersRepository.findOrderById(id);
  }

  createOrder(order: CreateOrderDto): Promise<any> {
    return this.ordersRepository.createOrder(order);
  }
}
