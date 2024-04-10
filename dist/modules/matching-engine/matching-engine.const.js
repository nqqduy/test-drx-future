"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANGUAGE = exports.NOTIFICATION_MESSAGE = exports.NOTIFICATION_TYPE = exports.sleep = exports.handleTimeout = exports.PREFIX_ASSET = exports.FUNDING_INTERVAL = exports.FUNDING_HISTORY_TIMESTAMP_KEY = exports.POSITION_HISTORY_TIMESTAMP_KEY = exports.BATCH_SIZE = exports.NotificationType = exports.NotificationEvent = exports.Coin = exports.ActionAdjustTpSl = exports.CommandCode = void 0;
const enumize_1 = require("../../shares/enums/enumize");
exports.CommandCode = enumize_1.enumize('INITIALIZE_ENGINE', 'START_ENGINE', 'UPDATE_INSTRUMENT', 'UPDATE_INSTRUMENT_EXTRA', 'CREATE_ACCOUNT', 'LOAD_POSITION', 'LOAD_POSITION_HISTORY', 'LOAD_FUNDING_HISTORY', 'LOAD_ORDER', 'WITHDRAW', 'DEPOSIT', 'LIQUIDATE', 'PAY_FUNDING', 'PLACE_ORDER', 'CANCEL_ORDER', 'TRIGGER_ORDER', 'DUMP', 'ADJUST_MARGIN_POSITION', 'ADJUST_LEVERAGE', 'ADJUST_TP_SL', 'LOAD_LEVERAGE_MARGIN', 'LOAD_TRADING_RULE', 'ADJUST_TP_SL_PRICE', 'CLOSE_INSURANCE', 'MAIL_FUNDING');
exports.ActionAdjustTpSl = enumize_1.enumize('PLACE', 'CANCEL');
exports.Coin = enumize_1.enumize('USDT', 'USD');
exports.NotificationEvent = enumize_1.enumize('OrderPlaced', 'OrderCanceled', 'OrderMatched', 'OrderTriggered', 'PositionLiquidated', 'WithdrawSubmitted', 'WithdrawUnsuccessfully', 'WithdrawSuccessfully', 'DepositSuccessfully');
exports.NotificationType = enumize_1.enumize('success', 'error');
exports.BATCH_SIZE = 5000;
exports.POSITION_HISTORY_TIMESTAMP_KEY = 'matching_engine_position_history_timestamp';
exports.FUNDING_HISTORY_TIMESTAMP_KEY = 'matching_engine_funding_history_timestamp';
exports.FUNDING_INTERVAL = '8';
exports.PREFIX_ASSET = 'PREFIX_ASSET_';
const delayTime = 50;
const handleTimeout = async (fn) => {
    await fn();
    await exports.sleep(delayTime);
    await exports.handleTimeout(fn);
};
exports.handleTimeout = handleTimeout;
const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
exports.sleep = sleep;
var NOTIFICATION_TYPE;
(function (NOTIFICATION_TYPE) {
    NOTIFICATION_TYPE["TP_SL_ORDER_TRIGGER"] = "TP_SL_ORDER_TRIGGER";
    NOTIFICATION_TYPE["FUNDING_FEE"] = "FUNDING_FEE";
})(NOTIFICATION_TYPE = exports.NOTIFICATION_TYPE || (exports.NOTIFICATION_TYPE = {}));
exports.NOTIFICATION_MESSAGE = new Map([
    ['TP_SL_ORDER_TRIGGER_EN', 'Future TP/SL Stop order has been triggered'],
    ['TP_SL_ORDER_TRIGGER_VI', 'Lệnh Dừng chốt lãi/ cắt lỗ Future đã được kích hoạt'],
    ['TP_SL_ORDER_TRIGGER_KR', '선물 이익실현/손절매 스탑 주문이 활성화되었습니다'],
    ['FUNDING_FEE_EN', 'Future Funding Fee has reached threshold'],
    ['FUNDING_FEE_KR', '선물 펀딩비가 한계점에 도달했습니다'],
    ['FUNDING_FEE_VI', 'Phí cấp vốn Future đã đạt ngưỡng'],
]);
var LANGUAGE;
(function (LANGUAGE) {
    LANGUAGE["ENGLISH"] = "EN";
    LANGUAGE["VIETNAMESE"] = "VI";
    LANGUAGE["KOREAN"] = "KR";
})(LANGUAGE = exports.LANGUAGE || (exports.LANGUAGE = {}));
//# sourceMappingURL=matching-engine.const.js.map