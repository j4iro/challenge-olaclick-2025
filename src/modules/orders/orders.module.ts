import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DatabaseModule } from 'src/database/database.module';
import { ordersProviders } from './orders.provider';
import { OrdersRepository } from './orders.repository';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, ...ordersProviders],
})
export class OrdersModule {}
