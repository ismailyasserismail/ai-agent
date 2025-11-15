import { createLogger } from '../../utils/logger';

const logger = createLogger('MockOrder');

type OrderStatus = 'processing' | 'shipped' | 'delivered';

interface OrderRecord {
  orderId: string;
  status: OrderStatus;
  eta: string;
  items: { sku: string; quantity: number }[];
}

const orders: OrderRecord[] = [
  {
    orderId: 'ORD-1001',
    status: 'processing',
    eta: '2024-05-10',
    items: [
      { sku: 'SKU-AR-001', quantity: 2 },
      { sku: 'SKU-EN-009', quantity: 1 },
    ],
  },
  {
    orderId: 'ORD-1002',
    status: 'shipped',
    eta: '2024-05-02',
    items: [{ sku: 'SKU-AR-222', quantity: 1 }],
  },
];

export const MockOrderService = {
  async getOrderStatus(orderId: string): Promise<OrderRecord | null> {
    logger.info('Fetching order status', { orderId });
    return orders.find((order) => order.orderId === orderId) ?? null;
  },
};
