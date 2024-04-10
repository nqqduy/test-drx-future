import { AccountRepository } from 'src/models/repositories/account.repository';
import { AccountService } from 'src/modules/account/account.service';
import { IndexService } from 'src/modules/index/index.service';
import { InstrumentService } from 'src/modules/instrument/instrument.service';
import { MatchingEngineService } from 'src/modules/matching-engine/matching-engine.service';
import { OrderService } from 'src/modules/order/order.service';
import { PositionService } from 'src/modules/position/position.service';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
export declare class MatchingEngineTestConsole {
    private readonly accountService;
    private readonly positionService;
    private readonly orderService;
    private readonly matchingEngineService;
    private readonly instrumentService;
    private readonly indexService;
    readonly kafkaClient: KafkaClient;
    private accountRepository;
    private readonly logger;
    constructor(accountService: AccountService, positionService: PositionService, orderService: OrderService, matchingEngineService: MatchingEngineService, instrumentService: InstrumentService, indexService: IndexService, kafkaClient: KafkaClient, accountRepository: AccountRepository);
    testOraclePrice(symbol: string, oraclePrice: string): Promise<void>;
    testIndexPrice(symbol: string, indexPrice: string): Promise<void>;
    testRedis(): Promise<void>;
    testPerformance(): Promise<void>;
    private createAccounts;
    private createOrder;
}
