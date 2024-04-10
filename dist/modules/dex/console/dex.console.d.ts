import { Logger } from '@nestjs/common';
import { DexService } from 'src/modules/dex/service/dex.service';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
export declare class DexConsole {
    private logger;
    private dexService;
    readonly kafkaClient: KafkaClient;
    constructor(logger: Logger, dexService: DexService, kafkaClient: KafkaClient);
    dexActions(): Promise<void>;
    dexActionsPicker(): Promise<void>;
    dexActionsSender(): Promise<void>;
    dexActionsVerifier(): Promise<void>;
    dexActionsHistory(): Promise<void>;
    dexActionsBalanceChecker(): Promise<void>;
}
