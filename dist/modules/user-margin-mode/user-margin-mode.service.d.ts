import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { OrderRepository } from 'src/models/repositories/order.repository';
import { PositionRepository } from 'src/models/repositories/position.repository';
import { UserMarginModeRepository } from 'src/models/repositories/user-margin-mode.repository';
import { AccountService } from '../account/account.service';
import { UpdateMarginModeDto } from './dto/update-user-margin-mode.dto';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
import { UserMarginModeEntity } from 'src/models/entities/user-margin-mode.entity';
import { TradingRulesRepository } from 'src/models/repositories/trading-rules.repository';
export declare class UserMarginModeService {
    private userMarginModeMaster;
    private readonly userMarginModeReport;
    private readonly positionRepoReport;
    private readonly instrumentRepoReport;
    private readonly orderRepoReport;
    private readonly tradingRuleRepoReport;
    private readonly accountService;
    readonly kafkaClient: KafkaClient;
    constructor(userMarginModeMaster: UserMarginModeRepository, userMarginModeReport: UserMarginModeRepository, positionRepoReport: PositionRepository, instrumentRepoReport: InstrumentRepository, orderRepoReport: OrderRepository, tradingRuleRepoReport: TradingRulesRepository, accountService: AccountService, kafkaClient: KafkaClient);
    canUpdateMarginMode(accountId: number, symbol: string, currentMarginMode: string, updateMarginMode: string): Promise<boolean>;
    canUpdateLeverage(accountId: number, symbol: string, marginMode: string, currentLeverage: number, updateLeverage: number): Promise<boolean>;
    updateMarginMode(userId: number, input: UpdateMarginModeDto): Promise<void>;
    getMarginMode(userId: number, instrumentId: number): Promise<UserMarginModeEntity>;
}
