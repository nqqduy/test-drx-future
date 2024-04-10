"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlesRepository = void 0;
const tslib_1 = require("tslib");
const candles_entity_1 = require("../entities/candles.entity");
const candle_const_1 = require("../../modules/candle/candle.const");
const typeorm_1 = require("typeorm");
let CandlesRepository = class CandlesRepository extends typeorm_1.Repository {
    async getLastCandleBefore(symbol, time) {
        return this.findOne({
            where: {
                symbol,
                resolution: candle_const_1.RESOLUTION_MINUTE,
                minute: typeorm_1.LessThan(time),
            },
            order: {
                minute: 'DESC',
            },
        });
    }
    async getCandlesInRange(symbol, time, resolution) {
        return this.find({
            where: {
                symbol,
                resolution: candle_const_1.RESOLUTION_MINUTE,
                minute: typeorm_1.Raw((alias) => `${alias} >= :start and ${alias} < :end`, {
                    start: time,
                    end: time + resolution,
                }),
            },
        });
    }
    async getLastCandleOfResolution(symbol, resolution) {
        console.log(".............................................................");
        console.log(symbol);
        return this.findOne({
            where: {
                symbol,
                resolution,
            },
            order: {
                minute: 'DESC',
            },
        });
    }
};
CandlesRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(candles_entity_1.CandlesEntity)
], CandlesRepository);
exports.CandlesRepository = CandlesRepository;
//# sourceMappingURL=candles.repository.js.map