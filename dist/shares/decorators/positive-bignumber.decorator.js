"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPositiveBigNumber = void 0;
const bignumber_js_1 = require("bignumber.js");
const class_validator_1 = require("class-validator");
function IsPositiveBigNumber(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            name: 'isPositiveBigNumber',
            target: object.constructor,
            propertyName: propertyName,
            options: Object.assign(Object.assign({}, validationOptions), { message: 'BigNumber string greater than 0' }),
            validator: {
                validate(value, _args) {
                    return typeof value === 'string' && new bignumber_js_1.default(value).gt(0);
                },
            },
        });
    };
}
exports.IsPositiveBigNumber = IsPositiveBigNumber;
//# sourceMappingURL=positive-bignumber.decorator.js.map