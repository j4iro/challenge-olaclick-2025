const ORDERS = [
  {
    clientName: 'Ana López',
    items: [
      { description: 'Ceviche', quantity: 2, unitPrice: 50 },
      { description: 'Chicha morada', quantity: 1, unitPrice: 10 },
    ],
  },
];

export class OrdersRepository {
  constructor() {}

  findAll(): Promise<any[]> {
    return Promise.resolve(ORDERS);
  }
}
