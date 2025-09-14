import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findActiveOrders(): Promise<any[]> {
    return this.ordersService.findActiveOrders();
  }

  @Get(':id')
  findOrderById(@Param('id') id: number): Promise<any> {
    return this.ordersService.findOrderById(id);
  }
}
