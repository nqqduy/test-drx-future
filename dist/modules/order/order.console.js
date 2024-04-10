"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderConsole = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_console_1 = require("nestjs-console");
const order_service_1 = require("./order.service");
let OrderConsole = class OrderConsole {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async insertCoinInfo() {
        await this.orderService.updateUserIdInOrder();
    }
    async updateEmailOrder() {
        await this.orderService.updateUserEmailInOrder();
    }
    async enableOrDisableCreateOrder(text) {
        let status = false;
        if (text === 'disable') {
            status = true;
        }
        await this.orderService.setCacheEnableOrDisableCreateOrder(status);
    }
};
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'order:update-userId',
        description: 'update userId and accountId',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], OrderConsole.prototype, "insertCoinInfo", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'order:update-email-order',
        description: 'update user email',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], OrderConsole.prototype, "updateEmailOrder", null);
tslib_1.__decorate([
    nestjs_console_1.Command({
        command: 'order:enable-create-order [text]',
        description: 'enable or disable create order',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderConsole.prototype, "enableOrDisableCreateOrder", null);
OrderConsole = tslib_1.__decorate([
    nestjs_console_1.Console(),
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [order_service_1.OrderService])
], OrderConsole);
exports.OrderConsole = OrderConsole;
//# sourceMappingURL=order.console.js.map