"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMarginModeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const instrument_repository_1 = require("../../models/repositories/instrument.repository");
const order_repository_1 = require("../../models/repositories/order.repository");
const position_repository_1 = require("../../models/repositories/position.repository");
const user_margin_mode_repository_1 = require("../../models/repositories/user-margin-mode.repository");
const order_enum_1 = require("../../shares/enums/order.enum");
const exceptions_1 = require("../../shares/exceptions");
const typeorm_2 = require("typeorm");
const account_service_1 = require("../account/account.service");
const kafka_client_1 = require("../../shares/kafka-client/kafka-client");
const kafka_enum_1 = require("../../shares/enums/kafka.enum");
const matching_engine_const_1 = require("../matching-engine/matching-engine.const");
const user_margin_mode_entity_1 = require("../../models/entities/user-margin-mode.entity");
const user_marging_mode_const_1 = require("./user-marging-mode.const");
const trading_rules_repository_1 = require("../../models/repositories/trading-rules.repository");
const socket_emitter_1 = require("../../shares/helpers/socket-emitter");
let UserMarginModeService = class UserMarginModeService {
    constructor(userMarginModeMaster, userMarginModeReport, positionRepoReport, instrumentRepoReport, orderRepoReport, tradingRuleRepoReport, accountService, kafkaClient) {
        this.userMarginModeMaster = userMarginModeMaster;
        this.userMarginModeReport = userMarginModeReport;
        this.positionRepoReport = positionRepoReport;
        this.instrumentRepoReport = instrumentRepoReport;
        this.orderRepoReport = orderRepoReport;
        this.tradingRuleRepoReport = tradingRuleRepoReport;
        this.accountService = accountService;
        this.kafkaClient = kafkaClient;
    }
    async canUpdateMarginMode(accountId, symbol, currentMarginMode, updateMarginMode) {
        if (currentMarginMode === updateMarginMode) {
            return true;
        }
        const [orders, positions] = await Promise.all([
            this.orderRepoReport.find({
                accountId,
                status: typeorm_2.In([order_enum_1.OrderStatus.ACTIVE, order_enum_1.OrderStatus.UNTRIGGERED]),
                symbol,
            }),
            this.positionRepoReport.find({
                accountId,
                currentQty: typeorm_2.Not('0'),
                symbol,
            }),
        ]);
        if (orders.length || positions.length) {
            return false;
        }
        return true;
    }
    async canUpdateLeverage(accountId, symbol, marginMode, currentLeverage, updateLeverage) {
        const [position, { maxLeverage }] = await Promise.all([
            this.positionRepoReport.findOne({
                where: {
                    accountId,
                    symbol,
                    currentQty: typeorm_2.Not('0'),
                },
            }),
            this.tradingRuleRepoReport.findOne({
                where: {
                    symbol,
                },
            }),
        ]);
        if (+updateLeverage > +maxLeverage) {
            throw new common_1.HttpException(exceptions_1.httpErrors.LEVERAGE_COULD_NOT_BE_CHANGE, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!position) {
            return true;
        }
        switch (marginMode) {
            case order_enum_1.MarginMode.CROSS:
                return true;
            case order_enum_1.MarginMode.ISOLATE:
                return updateLeverage >= currentLeverage;
            default:
                break;
        }
        return true;
    }
    async updateMarginMode(userId, input) {
        const { instrumentId, marginMode, leverage } = input;
        const [{ symbol }, findMarginMode] = await Promise.all([
            this.instrumentRepoReport.findOne(instrumentId),
            this.userMarginModeReport.findOne({
                userId,
                instrumentId,
            }),
        ]);
        let asset = '';
        if (symbol.includes('USDM')) {
            asset = symbol.split('USDM')[0];
        }
        else if (symbol.includes('USDT')) {
            asset = 'USDT';
        }
        else {
            asset = 'USD';
        }
        const account = await this.accountService.getFirstAccountByOwnerId(userId, asset);
        const currentLeverage = findMarginMode ? findMarginMode.leverage : user_marging_mode_const_1.DEFAULT_LEVERAGE;
        const currentMarginMode = findMarginMode ? findMarginMode.marginMode : user_marging_mode_const_1.DEFAULT_MARGIN_MODE;
        if (!(await this.canUpdateMarginMode(account.id, symbol, currentMarginMode, marginMode))) {
            throw new common_1.HttpException(exceptions_1.httpErrors.MARGIN_MODE_COULD_NOT_BE_CHANGE, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!(await this.canUpdateLeverage(account.id, symbol, currentMarginMode, +currentLeverage, +leverage))) {
            throw new common_1.HttpException(exceptions_1.httpErrors.LEVERAGE_COULD_NOT_BE_CHANGE, common_1.HttpStatus.BAD_REQUEST);
        }
        const position = await this.positionRepoReport.findOne({
            where: {
                symbol,
                userId,
            },
        });
        if (!position) {
            await this.userMarginModeMaster.update({ instrumentId, userId }, { leverage: input.leverage, marginMode: input.marginMode });
            socket_emitter_1.SocketEmitter.getInstance().emitAdjustLeverage({
                accountId: account.id,
                leverage: input.leverage,
                symbol: symbol,
                marginMode: input.marginMode,
                asset,
                userId,
                oldLeverage: currentLeverage,
                status: 'SUCCESS',
            }, +userId);
        }
        else {
            await this.kafkaClient.send(kafka_enum_1.KafkaTopics.matching_engine_input, {
                code: matching_engine_const_1.CommandCode.ADJUST_LEVERAGE,
                data: {
                    id: findMarginMode ? findMarginMode.id : null,
                    accountId: account.id,
                    leverage: input.leverage,
                    symbol: symbol,
                    marginMode: input.marginMode,
                    asset,
                    userId,
                    oldLeverage: currentLeverage,
                },
            });
        }
    }
    async getMarginMode(userId, instrumentId) {
        const findMarginMode = await this.userMarginModeMaster.findOne({
            userId,
            instrumentId,
        });
        if (!findMarginMode) {
            return await this.userMarginModeMaster.save({
                userId,
                instrumentId: instrumentId,
                marginMode: user_marging_mode_const_1.DEFAULT_MARGIN_MODE,
                leverage: user_marging_mode_const_1.DEFAULT_LEVERAGE.toString(),
            });
        }
        return findMarginMode;
    }
};
UserMarginModeService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(user_margin_mode_repository_1.UserMarginModeRepository, 'master')),
    tslib_1.__param(1, typeorm_1.InjectRepository(user_margin_mode_repository_1.UserMarginModeRepository, 'report')),
    tslib_1.__param(2, typeorm_1.InjectRepository(position_repository_1.PositionRepository, 'report')),
    tslib_1.__param(3, typeorm_1.InjectRepository(instrument_repository_1.InstrumentRepository, 'report')),
    tslib_1.__param(4, typeorm_1.InjectRepository(order_repository_1.OrderRepository, 'report')),
    tslib_1.__param(5, typeorm_1.InjectRepository(trading_rules_repository_1.TradingRulesRepository, 'report')),
    tslib_1.__metadata("design:paramtypes", [user_margin_mode_repository_1.UserMarginModeRepository,
        user_margin_mode_repository_1.UserMarginModeRepository,
        position_repository_1.PositionRepository,
        instrument_repository_1.InstrumentRepository,
        order_repository_1.OrderRepository,
        trading_rules_repository_1.TradingRulesRepository,
        account_service_1.AccountService,
        kafka_client_1.KafkaClient])
], UserMarginModeService);
exports.UserMarginModeService = UserMarginModeService;
//# sourceMappingURL=user-margin-mode.service.js.map