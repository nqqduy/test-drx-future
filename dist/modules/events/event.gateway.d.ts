import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    static getOrderbookRoom(symbol: string): string;
    static getTradesRoom(symbol: string): string;
    handleDisconnect(client: Socket): Promise<void>;
    handleConnection(client: Socket): Promise<void>;
}
