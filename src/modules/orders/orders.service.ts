import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order-status.enum';

@Injectable()
export class OrdersService {
  private readonly STATUS_TRANSITIONS = new Map([
    [OrderStatus.INITIATED, OrderStatus.SENT],
    [OrderStatus.SENT, OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED, null], // null = delete from database
  ]);

  constructor(private readonly ordersRepository: OrdersRepository) {}

  findActiveOrders(): Promise<Order[]> {
    return this.ordersRepository.findActiveOrders();
  }

  async findOrderById(id: number): Promise<Order | null> {
    const order = await this.ordersRepository.findOrderById(id, {
      includeItems: true,
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  createOrder(order: CreateOrderDto): Promise<any> {
    return this.ordersRepository.createOrder(order);
  }

  async advanceOrderStatus(id: number): Promise<Order | { message: string }> {
    const order = await this.ordersRepository.findOrderById(id);

    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    const currentStatus = order.status;
    const nextStatus = this.STATUS_TRANSITIONS.get(currentStatus);

    if (nextStatus === undefined) {
      throw new BadRequestException(`Invalid current status: ${currentStatus}`);
    }

    if (nextStatus === null) {
      await this.ordersRepository.deleteOrder(id);
      return { message: 'Order completed and removed from database' };
    }

    await this.ordersRepository.updateStatus(id, nextStatus);

    const updatedOrder = await this.ordersRepository.findOrderById(id);
    return updatedOrder!;
  }
}
