import { Module } from '@nestjs/common';
import { OrdersModule } from './modules/orders/orders.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [OrdersModule, CacheModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
