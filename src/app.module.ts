import { Module } from '@nestjs/common';
import { OrdersModule } from './modules/orders/orders.module';
import { CacheModule } from './cache/cache.module';
import { HealthController } from './health.controller';

@Module({
  imports: [OrdersModule, CacheModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
