import { Sequelize } from 'sequelize-typescript';
import { Order } from '../modules/orders/entities/order.entity';
import { OrderItems } from '../modules/orders/entities/order-items.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'olaclick',
      });
      sequelize.addModels([Order, OrderItems]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
