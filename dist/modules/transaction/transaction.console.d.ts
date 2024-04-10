import { Logger } from '@nestjs/common';
import { LatestBlockService } from 'src/modules/latest-block/latest-block.service';
import { TransactionService } from 'src/modules/transaction/transaction.service';
import { KafkaClient } from 'src/shares/kafka-client/kafka-client';
export declare class TransactionConsole {
    private readonly logger;
    readonly kafkaClient: KafkaClient;
    private readonly latestBlockService;
    private readonly transactionService;
    constructor(logger: Logger, kafkaClient: KafkaClient, latestBlockService: LatestBlockService, transactionService: TransactionService);
    private sendTransactions;
    updateTransactions(): Promise<void>;
}
