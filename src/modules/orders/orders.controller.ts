import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

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

  @Post()
  createOrder(@Body() order: CreateOrderDto): Promise<any> {
    return this.ordersService.createOrder(order);
  }
}
