import { Sequelize } from 'sequelize-typescript';
import { Order } from '../modules/orders/entities/order.entity';
import { OrderItems } from '../modules/orders/entities/order-items.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'olaclick',
      });
      sequelize.addModels([Order, OrderItems]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
