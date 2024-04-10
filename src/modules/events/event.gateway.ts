import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import * as config from 'config';

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  public static getOrderbookRoom(symbol: string) {
    return `orderbook_${symbol}`;
  }

  public static getTradesRoom(symbol: string) {
    return `trades_${symbol}`;
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake.query?.authorization;
    if (token) {
      try {
        const publicKey = Buffer.from(config.get('jwt_key.public').toString(), 'base64').toString('ascii');

        const payload = (verify(token, publicKey, { algorithms: ['RS256'] }) as unknown) as { sub: number };
        client.join(Number(payload.sub));
      } catch (e) {
        this.logger.log(e);
        this.logger.log(`Failed to decode access token for client ${client.id}`);
      }
    } else {
      this.logger.log(`Guest connected: ${client.id}`);
    }

    client.on('leave', (symbol: string) => {
      this.logger.log(`Client ${client.id} leave ${symbol} `);
      client.leave(EventGateway.getOrderbookRoom(symbol));
      client.leave(EventGateway.getTradesRoom(symbol));
    });

    client.on('join', (symbol: string) => {
      this.logger.log(`Client ${client.id} join ${symbol} `);
      client.join([EventGateway.getOrderbookRoom(symbol), EventGateway.getTradesRoom(symbol)]);
    });
  }
}
