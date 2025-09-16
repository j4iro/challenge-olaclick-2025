import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order-status.enum';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class OrdersService {
  private readonly ACTIVE_ORDERS_CACHE_KEY = 'active_orders';
  private readonly CACHE_TTL = 30 * 1000;

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly cacheService: CacheService,
  ) {}

  async findActiveOrders(): Promise<Order[]> {
    const cachedOrders = await this.cacheService.get<Order[]>(
      this.ACTIVE_ORDERS_CACHE_KEY,
    );

    if (cachedOrders) {
      return cachedOrders;
    }

    const orders = await this.ordersRepository.findActiveOrders();
    await this.cacheService.set(
      this.ACTIVE_ORDERS_CACHE_KEY,
      orders,
      this.CACHE_TTL,
    );

    return orders;
  }

  async findOrderById(id: number): Promise<Order | null> {
    const order = await this.ordersRepository.findOrderById(id, {
      includeItems: true,
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  async createOrder(order: CreateOrderDto): Promise<any> {
    const result = await this.ordersRepository.createOrder(order);
    await this.cacheService.del(this.ACTIVE_ORDERS_CACHE_KEY);
    return result;
  }

  async advanceOrderStatus(id: number): Promise<Order | { message: string }> {
    const order = await this.ordersRepository.findOrderById(id);

    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    const currentStatus = order.status;
    const nextStatus = this.getNextStatus(currentStatus);

    if (nextStatus === undefined) {
      throw new BadRequestException(`Invalid current status: ${currentStatus}`);
    }

    if (nextStatus === null) {
      await this.ordersRepository.deleteOrder(id);
      await this.cacheService.del(this.ACTIVE_ORDERS_CACHE_KEY);
      return { message: 'Order completed and removed from database' };
    }

    await this.ordersRepository.updateStatus(id, nextStatus);
    await this.cacheService.del(this.ACTIVE_ORDERS_CACHE_KEY);

    const updatedOrder = await this.ordersRepository.findOrderById(id);
    return updatedOrder!;
  }

  private getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    const STATUS_TRANSITIONS = new Map([
      [OrderStatus.INITIATED, OrderStatus.SENT],
      [OrderStatus.SENT, OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED, null], // null = delete from database
    ]);

    return STATUS_TRANSITIONS.get(currentStatus) ?? null;
  }
}
