/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { OrderStatus } from './entities/order-status.enum';
import { Order } from './entities/order.entity';
import { CacheService } from 'src/cache/cache.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: jest.Mocked<OrdersRepository>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const mockRepository = {
      findOrderById: jest.fn(),
      updateStatus: jest.fn(),
      deleteOrder: jest.fn(),
    };

    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockRepository,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get(OrdersRepository);
    cacheService = module.get(CacheService);

    jest.clearAllMocks();
  });

  describe('advanceOrderStatus', () => {
    it('should advance order from INITIATED to SENT', async () => {
      // Arrange
      const orderId = 1;
      const mockOrder = { id: orderId, status: OrderStatus.INITIATED } as Order;
      const mockUpdatedOrder = {
        id: orderId,
        status: OrderStatus.SENT,
      } as Order;

      repository.findOrderById.mockResolvedValueOnce(mockOrder);
      repository.findOrderById.mockResolvedValueOnce(mockUpdatedOrder);

      // Act
      const result = await service.advanceOrderStatus(orderId);

      // Assert
      expect(repository.findOrderById).toHaveBeenCalledWith(orderId);
      expect(repository.updateStatus).toHaveBeenCalledWith(
        orderId,
        OrderStatus.SENT,
      );
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should advance order from SENT to DELIVERED', async () => {
      // Arrange
      const orderId = 1;
      const mockOrder = { id: orderId, status: OrderStatus.SENT } as Order;
      const mockUpdatedOrder = {
        id: orderId,
        status: OrderStatus.DELIVERED,
      } as Order;

      repository.findOrderById.mockResolvedValueOnce(mockOrder);
      repository.findOrderById.mockResolvedValueOnce(mockUpdatedOrder);

      // Act
      const result = await service.advanceOrderStatus(orderId);

      // Assert
      expect(repository.findOrderById).toHaveBeenCalledWith(orderId);
      expect(repository.updateStatus).toHaveBeenCalledWith(
        orderId,
        OrderStatus.DELIVERED,
      );
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should delete order when status is DELIVERED', async () => {
      // Arrange
      const orderId = 1;
      const mockOrder = { id: orderId, status: OrderStatus.DELIVERED } as Order;

      repository.findOrderById.mockResolvedValueOnce(mockOrder);

      // Act
      const result = await service.advanceOrderStatus(orderId);

      // Assert
      expect(repository.findOrderById).toHaveBeenCalledWith(orderId);
      expect(repository.deleteOrder).toHaveBeenCalledWith(orderId);
      expect(result).toEqual({
        message: 'Order completed and removed from database',
      });
    });

    it('should throw NotFoundException when order does not exist', async () => {
      // Arrange
      const orderId = 999;
      repository.findOrderById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.advanceOrderStatus(orderId)).rejects.toThrow(
        `Order with ID ${orderId} not found`,
      );
    });

    it('should delete order when status is invalid (treated as completed)', async () => {
      // Arrange
      const orderId = 1;
      const mockOrder = {
        id: orderId,
        status: 'INVALID_STATUS' as OrderStatus,
      } as Order;

      repository.findOrderById.mockResolvedValueOnce(mockOrder);

      // Act
      const result = await service.advanceOrderStatus(orderId);

      // Assert
      expect(repository.findOrderById).toHaveBeenCalledWith(orderId);
      expect(repository.deleteOrder).toHaveBeenCalledWith(orderId);
      expect(result).toEqual({
        message: 'Order completed and removed from database',
      });
    });
  });
});
