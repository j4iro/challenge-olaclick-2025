import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  clientName: string;

  @IsArray()
  items: OrderItemDto[];
}

class OrderItemDto {
  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}
