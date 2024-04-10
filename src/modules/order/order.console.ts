import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { OrderService } from './order.service';

@Console()
@Injectable()
export class OrderConsole {
  constructor(private orderService: OrderService) {}

  @Command({
    command: 'order:update-userId',
    description: 'update userId and accountId',
  })
  async insertCoinInfo(): Promise<void> {
    await this.orderService.updateUserIdInOrder();
  }

  @Command({
    command: 'order:update-email-order',
    description: 'update user email',
  })
  async updateEmailOrder(): Promise<void> {
    await this.orderService.updateUserEmailInOrder();
  }
  // @Command({
  //   command: 'order:test-update-email-order [orderId]',
  //   description: 'update user email',
  // })
  // async testUpdateEmailOrder(orderId: string): Promise<void> {
  //   console.log(orderId);

  //   await this.orderService.testUpdateUserEmailInOrder(orderId);
  // }

  @Command({
    command: 'order:enable-create-order [text]',
    description: 'enable or disable create order',
  })
  async enableOrDisableCreateOrder(text: string): Promise<void> {
    let status = false;
    if (text === 'disable') {
      status = true;
    }
    await this.orderService.setCacheEnableOrDisableCreateOrder(status);
  }
}
