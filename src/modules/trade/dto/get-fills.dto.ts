export class FillDto {
  id: number;
  orderId: number;
  accountId: number;
  fee: string;
  quantity: string;
  price: string;
  symbol: string;
  liquidity: 'Taker' | 'Maker';
  orderType: string;
  tradeSide: 'BUY' | 'SELL';
  createdAt: Date;
}
