"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEmitter = void 0;
class BaseEmitter {
    static getInstance() {
        if (!BaseEmitter.instance) {
            BaseEmitter.instance = new BaseEmitter();
        }
        return BaseEmitter.instance;
    }
    emitTrades() { }
    emitOrderbook() { }
    async emitOrders() { }
    async emitUpdatedTrades() { }
}
exports.BaseEmitter = BaseEmitter;
//# sourceMappingURL=base-emitter.js.map