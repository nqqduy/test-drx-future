import { Logger } from '@nestjs/common';
import { Connection } from 'typeorm';
export declare class HealthService {
    private reportConnection;
    private masterConnection;
    private readonly logger;
    constructor(reportConnection: Connection, masterConnection: Connection, logger: Logger);
    getHealth(): Promise<Record<string, unknown>>;
}
