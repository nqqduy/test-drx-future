"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const positive_bignumber_decorator_1 = require("../../../shares/decorators/positive-bignumber.decorator");
const order_enum_1 = require("../../../shares/enums/order.enum");
const validate_decorator_1 = require("../decorator/validate-decorator");
class CreateOrderDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({ description: 'Side of order', name: 'side', enum: order_enum_1.OrderSide, example: order_enum_1.OrderSide.BUY }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderSide)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "side", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        example: 'USD_M',
    }),
    class_validator_1.IsString(),
    class_validator_1.IsIn(Object.keys(order_enum_1.ContractType)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "contractType", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: true, description: 'Symbol of contract, get from /api/v1/instruments', example: 'BTCUSDT' }),
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "symbol", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: true, description: 'Type of order, LIMIT or MARKET', enum: ['LIMIT', 'MARKET'] }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderType)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: true, description: 'Quantity of order', example: '1' }),
    class_validator_1.IsNotEmpty(),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    validate_decorator_1.IsNotHaveSpace('quantity'),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "quantity", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: true, description: 'Price of order', example: '29200' }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    validate_decorator_1.IsNotHaveSpace('price'),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "price", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ required: true, description: 'Equal to quantity', example: '1' }),
    class_transformer_1.Transform((params) => {
        console.log(params);
    }, {}),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "remaining", void 0);
tslib_1.__decorate([
    class_validator_1.ValidateIf((_object, value) => !!value),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "executedPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        description: 'Tp sl type of order',
        enum: [order_enum_1.TpSlType.STOP_MARKET, order_enum_1.TpSlType.STOP_LIMIT, order_enum_1.TpSlType.TRAILING_STOP],
    }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.TpSlType)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "tpSLType", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ description: 'Stop/Tpsl price', example: '27000' }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    validate_decorator_1.IsNotHaveSpace('tpSLPrice'),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "tpSLPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        description: 'Stop condition, if price greater than last price / mark price (depend on trigger) than GT else LT',
        required: false,
        enum: ['LT', 'GT'],
    }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderStopCondition)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "stopCondition", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        description: 'Like stopCondition, compare takeProfit with trigger price (last price or mark price)',
        enum: ['LT', 'GT'],
    }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderStopCondition)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "takeProfitCondition", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        description: 'Like stopCondition, compare stopLoss with trigger price (last price or mark price)',
        enum: ['LT', 'GT'],
    }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderStopCondition)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "stopLossCondition", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ description: 'Price take profit', required: false, example: '29500' }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    validate_decorator_1.IsNotHaveSpace('takeProfit'),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "takeProfit", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ description: 'Price stop loss', required: false, example: '29000' }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    validate_decorator_1.IsNotHaveSpace('stopLoss'),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "stopLoss", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ description: 'Trigger type', enum: [order_enum_1.OrderTrigger.LAST, order_enum_1.OrderTrigger.ORACLE] }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderTrigger)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "trigger", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        description: 'Time in force',
        enum: [order_enum_1.OrderTimeInForce.FOK, order_enum_1.OrderTimeInForce.GTC, order_enum_1.OrderTimeInForce.IOC],
    }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderTimeInForce)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "timeInForce", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ description: 'Callback rate of trailing stop order', required: false, example: '1' }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    validate_decorator_1.IsNotHaveSpace('callbackRate'),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "callbackRate", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ description: 'Activation price of trailing stop order', required: false, example: '29500' }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    positive_bignumber_decorator_1.IsPositiveBigNumber(),
    validate_decorator_1.IsNotHaveSpace('activationPrice'),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "activationPrice", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        description: 'Trigger of take profit order',
        required: false,
        enum: [order_enum_1.OrderTrigger.LAST, order_enum_1.OrderTrigger.ORACLE],
    }),
    class_validator_1.IsOptional(),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderTrigger)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "takeProfitTrigger", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        description: 'Trigger of stop loss order',
        required: false,
        enum: [order_enum_1.OrderTrigger.LAST, order_enum_1.OrderTrigger.ORACLE],
    }),
    class_validator_1.IsOptional(),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.OrderTrigger)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "stopLossTrigger", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ description: 'is post only', required: false }),
    class_validator_1.IsBoolean(),
    tslib_1.__metadata("design:type", Boolean)
], CreateOrderDto.prototype, "isPostOnly", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({ description: 'asset of order, map with symbol', enum: Object.keys(order_enum_1.AssetOrder) }),
    class_validator_1.ValidateIf((_object, value) => !!value),
    class_validator_1.IsIn(Object.keys(order_enum_1.AssetOrder)),
    tslib_1.__metadata("design:type", String)
], CreateOrderDto.prototype, "asset", void 0);
exports.CreateOrderDto = CreateOrderDto;
//# sourceMappingURL=create-order.dto.js.map