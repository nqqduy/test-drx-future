"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNotHaveSpace = void 0;
const class_validator_1 = require("class-validator");
function IsNotHaveSpace(property, validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            name: 'IsNotHaveSpace',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value) {
                    return !value.includes(' ');
                },
                defaultMessage(args) {
                    return args.property + ' must not have space';
                },
            },
        });
    };
}
exports.IsNotHaveSpace = IsNotHaveSpace;
//# sourceMappingURL=validate-decorator.js.map