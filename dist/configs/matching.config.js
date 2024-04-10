"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingEngineConfig = void 0;
const config = require("config");
const positionHistoryTime = Number(config.get('matching.position_history_time'));
const fundingHistoryTime = Number(config.get('matching.funding_history_time'));
exports.MatchingEngineConfig = {
    positionHistoryTime,
    fundingHistoryTime,
};
//# sourceMappingURL=matching.config.js.map