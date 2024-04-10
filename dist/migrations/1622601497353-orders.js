"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders1622601497353 = void 0;
const order_entity_1 = require("../models/entities/order.entity");
const order_enum_1 = require("../shares/enums/order.enum");
const typeorm_1 = require("typeorm");
class orders1622601497353 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'orders',
            columns: [
                {
                    name: 'id',
                    type: 'bigint',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    unsigned: true,
                },
                {
                    name: 'accountId',
                    type: 'bigint',
                    unsigned: true,
                    default: 0,
                },
                {
                    name: 'instrumentSymbol',
                    type: 'varchar(20)',
                    isNullable: true,
                },
                {
                    name: 'side',
                    type: 'varchar(4)',
                    comment: Object.keys(order_enum_1.OrderSide).join(','),
                },
                {
                    name: 'type',
                    type: 'varchar(6)',
                    comment: Object.keys(order_enum_1.OrderType).join(','),
                    default: `'${order_enum_1.OrderType.LIMIT}'`,
                },
                {
                    name: 'quantity',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                },
                {
                    name: 'price',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                },
                {
                    name: 'lockPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'orderValue',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'remaining',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                },
                {
                    name: 'executedPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'timeInForce',
                    type: 'varchar(3)',
                    isNullable: false,
                    comment: Object.keys(order_enum_1.OrderTimeInForce).join(','),
                },
                {
                    name: 'stopType',
                    type: 'varchar(20)',
                    isNullable: true,
                    comment: Object.keys(order_enum_1.TpSlType).join(','),
                },
                {
                    name: 'stopPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'trigger',
                    type: 'varchar(6)',
                    isNullable: true,
                    comment: Object.keys(order_enum_1.OrderTrigger).join(','),
                },
                {
                    name: 'trailValue',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'vertexPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'status',
                    type: 'varchar(12)',
                    default: "'pending'",
                    comment: Object.keys(order_enum_1.OrderStatus).join(','),
                },
                {
                    name: 'isPostOnly',
                    type: 'boolean',
                    default: '0',
                },
                {
                    name: 'isHidden',
                    type: 'boolean',
                    default: '0',
                },
                {
                    name: 'displayQuantity',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                },
                {
                    name: 'isReduceOnly',
                    type: 'boolean',
                    default: '0',
                },
                {
                    name: 'note',
                    type: 'varchar(30)',
                    isNullable: true,
                },
                {
                    name: 'operationId',
                    type: 'bigint',
                    unsigned: true,
                    default: 0,
                },
                {
                    name: 'unrealisedPnl',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'leverage',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    default: 0,
                },
                {
                    name: 'marginMode',
                    type: 'varchar(20)',
                    isNullable: true,
                    comment: Object.keys(order_enum_1.MarginMode).join(','),
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.query(`ALTER TABLE orders AUTO_INCREMENT = ${order_entity_1.MIN_ORDER_ID};`);
        await queryRunner.createIndices('orders', [
            new typeorm_1.TableIndex({
                columnNames: ['accountId', 'instrumentSymbol', 'status'],
                isUnique: false,
                name: 'IDX-orders-accountId_instrumentSymbol_status',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['accountId', 'createdAt'],
                isUnique: false,
                name: 'IDX-orders-accountId_createdAt',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['status'],
                isUnique: false,
                name: 'IDX-orders-status',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('orders'))
            await queryRunner.dropTable('orders');
    }
}
exports.orders1622601497353 = orders1622601497353;
//# sourceMappingURL=1622601497353-orders.js.map