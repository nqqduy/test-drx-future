"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instruments1636660800735 = void 0;
const instrument_enum_1 = require("../shares/enums/instrument.enum");
const typeorm_1 = require("typeorm");
class instruments1636660800735 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'instruments',
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
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'symbol',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'rootSymbol',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'state',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'type',
                    type: 'varchar(20)',
                    isNullable: false,
                    comment: Object.keys(instrument_enum_1.InstrumentTypes).join(','),
                },
                {
                    name: 'expiry',
                    type: 'datetime',
                    isNullable: true,
                },
                {
                    name: 'baseUnderlying',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'quoteCurrency',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'underlyingSymbol',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'settleCurrency',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'initMargin',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'maintainMargin',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'deleverageable',
                    type: 'varchar(20)',
                    default: `'${instrument_enum_1.InstrumentDeleverageable.DELEVERAGEABLED}'`,
                    comment: Object.keys(instrument_enum_1.InstrumentDeleverageable).join(','),
                },
                {
                    name: 'makerFee',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'takerFee',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'settlementFee',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'hasLiquidity',
                    type: 'varchar(20)',
                    default: `'${instrument_enum_1.InstrumentHasLiquidity.HAS_LIQUIDITY}'`,
                    comment: Object.keys(instrument_enum_1.InstrumentHasLiquidity).join(','),
                },
                {
                    name: 'referenceIndex',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'settlementIndex',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'fundingBaseIndex',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'fundingQuoteIndex',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'fundingPremiumIndex',
                    type: 'varchar',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'fundingInterval',
                    type: 'tinyint',
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'tickSize',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                },
                {
                    name: 'contractSize',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                },
                {
                    name: 'lotSize',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                },
                {
                    name: 'maxPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'maxOrderQty',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'multiplier',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'optionStrikePrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'optionKoPrice',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'riskLimit',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'riskStep',
                    type: 'decimal',
                    precision: 22,
                    scale: 8,
                    isNullable: true,
                    default: null,
                },
                {
                    name: 'rank',
                    type: 'int',
                    isNullable: false,
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
        }));
        await queryRunner.createIndices('instruments', [
            new typeorm_1.TableIndex({
                columnNames: ['type'],
                isUnique: false,
                name: 'IDX-instruments-type',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['symbol'],
                isUnique: true,
                name: 'IDX-instruments-symbol',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['deleverageable'],
                isUnique: false,
                name: 'IDX-instruments-deleverageable',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['hasLiquidity'],
                isUnique: false,
                name: 'IDX-instruments-hasLiquidity',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['createdAt'],
                isUnique: false,
                name: 'IDX-instruments-createdAt',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('instruments')) {
            await queryRunner.dropTable('instruments');
        }
    }
}
exports.instruments1636660800735 = instruments1636660800735;
//# sourceMappingURL=1636660800735-instruments.js.map