"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumberDecimal = exports.formatPercent = exports.isNumber = exports.formatUSDAmount = exports.getValueClassName = exports.formatOrderEnum = exports.formatQuantity = exports.formatPrice = void 0;
const bignumber_js_1 = require("bignumber.js");
const instrument_entity_1 = require("../models/entities/instrument.entity");
const formatNumber = (number, precision, zeroValue) => {
    if (number === undefined || number === null || number === '' || Number.isNaN(Number(number))) {
        return zeroValue;
    }
    return Number(number)
        .toFixed(precision)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
function formatPrice(number, instrument, zeroValue = '-') {
    const tickSize = instrument === null || instrument === void 0 ? void 0 : instrument.tickSize;
    const precision = -Math.ceil(Math.log10(Number(tickSize)));
    return formatNumber(number, precision, zeroValue);
}
exports.formatPrice = formatPrice;
function formatQuantity(number, instrument, zeroValue = '-') {
    const contractSize = instrument === null || instrument === void 0 ? void 0 : instrument.contractSize;
    const lotSize = instrument === null || instrument === void 0 ? void 0 : instrument.lotSize;
    const minimumQuantity = Number(contractSize) * Number(lotSize);
    const precision = -Math.ceil(Math.log10(Number(minimumQuantity)));
    return formatNumber(number, precision, zeroValue);
}
exports.formatQuantity = formatQuantity;
function formatOrderEnum(value) {
    if (!value) {
        return '';
    }
    const parts = value.toLowerCase().split('_');
    return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}
exports.formatOrderEnum = formatOrderEnum;
function getValueClassName(value, positiveClass = 'App-positive-value', neutralClass = '', negativeClass = 'App-negative-value') {
    if (value === undefined || value === null) {
        return neutralClass;
    }
    const number = parseFloat(value);
    if (number > 0) {
        return positiveClass;
    }
    else if (number === 0) {
        return neutralClass;
    }
    else {
        return negativeClass;
    }
}
exports.getValueClassName = getValueClassName;
const formatUSDAmount = (amount) => {
    return formatNumber(amount, 6, '');
};
exports.formatUSDAmount = formatUSDAmount;
const isNumber = (str) => {
    return !new bignumber_js_1.default(str).isNaN();
};
exports.isNumber = isNumber;
const formatPercent = (percent, precision = 4) => {
    return `${formatNumber(`${percent}`, precision, `0.${'0'.repeat(precision)}`)}%`;
};
exports.formatPercent = formatPercent;
const formatNumberDecimal = (number) => {
    return new bignumber_js_1.default(number).toFormat(8, 1);
};
exports.formatNumberDecimal = formatNumberDecimal;
//# sourceMappingURL=number-formatter.js.map