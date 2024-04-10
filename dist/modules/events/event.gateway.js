"use strict";
var EventGateway_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventGateway = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const jsonwebtoken_1 = require("jsonwebtoken");
const socket_io_1 = require("socket.io");
const config = require("config");
let EventGateway = EventGateway_1 = class EventGateway {
    constructor() {
        this.logger = new common_1.Logger('AppGateway');
    }
    static getOrderbookRoom(symbol) {
        return `orderbook_${symbol}`;
    }
    static getTradesRoom(symbol) {
        return `trades_${symbol}`;
    }
    async handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleConnection(client) {
        var _a;
        const token = (_a = client.handshake.query) === null || _a === void 0 ? void 0 : _a.authorization;
        if (token) {
            try {
                const publicKey = Buffer.from(config.get('jwt_key.public').toString(), 'base64').toString('ascii');
                const payload = jsonwebtoken_1.verify(token, publicKey, { algorithms: ['RS256'] });
                client.join(Number(payload.sub));
            }
            catch (e) {
                this.logger.log(e);
                this.logger.log(`Failed to decode access token for client ${client.id}`);
            }
        }
        else {
            this.logger.log(`Guest connected: ${client.id}`);
        }
        client.on('leave', (symbol) => {
            this.logger.log(`Client ${client.id} leave ${symbol} `);
            client.leave(EventGateway_1.getOrderbookRoom(symbol));
            client.leave(EventGateway_1.getTradesRoom(symbol));
        });
        client.on('join', (symbol) => {
            this.logger.log(`Client ${client.id} join ${symbol} `);
            client.join([EventGateway_1.getOrderbookRoom(symbol), EventGateway_1.getTradesRoom(symbol)]);
        });
    }
};
tslib_1.__decorate([
    websockets_1.WebSocketServer(),
    tslib_1.__metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], EventGateway.prototype, "server", void 0);
EventGateway = EventGateway_1 = tslib_1.__decorate([
    websockets_1.WebSocketGateway()
], EventGateway);
exports.EventGateway = EventGateway;
//# sourceMappingURL=event.gateway.js.map