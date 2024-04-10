"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumBalance = void 0;
const bignumber_js_1 = require("bignumber.js");
const sumBalance = (...args) => {
    let sum = '0';
    for (const arg of args) {
        sum = new bignumber_js_1.default(arg).plus(sum).toString();
    }
    return sum;
};
exports.sumBalance = sumBalance;
//# sourceMappingURL=sum-balance.js.map