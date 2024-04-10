"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDateFieldsForOrders = exports.convertFundingHistoriesDateFields = exports.convertDateFields = void 0;
const matching_engine_const_1 = require("./matching-engine.const");
function convertDateFields(object, entity) {
    if (entity.createdAt) {
        entity.createdAt = new Date(entity.createdAt);
    }
    else {
        entity.createdAt = new Date();
    }
    entity.updatedAt = new Date();
    return Object.assign(object, entity);
}
exports.convertDateFields = convertDateFields;
function convertFundingHistoriesDateFields(object, entity) {
    entity.time = new Date(entity.time);
    entity.fundingInterval = matching_engine_const_1.FUNDING_INTERVAL;
    return this.convertDateFields(object, entity);
}
exports.convertFundingHistoriesDateFields = convertFundingHistoriesDateFields;
function convertDateFieldsForOrders(object, entity) {
    if (entity.createdAt) {
        entity.createdAt = new Date(entity.createdAt);
    }
    else {
        entity.createdAt = new Date();
    }
    if (entity.updatedAt) {
        entity.updatedAt = new Date(entity.updatedAt);
    }
    else {
        entity.updatedAt = new Date();
    }
    entity.orderMargin = entity.orderMargin ? entity.orderMargin : '0';
    entity.cost = entity.cost ? entity.cost : '0';
    entity.originalCost = entity.originalCost ? entity.originalCost : '0';
    entity.originalOrderMargin = entity.originalOrderMargin ? entity.originalOrderMargin : '0';
    return Object.assign(object, entity);
}
exports.convertDateFieldsForOrders = convertDateFieldsForOrders;
//# sourceMappingURL=helper.js.map