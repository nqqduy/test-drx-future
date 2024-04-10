import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class removeTakeProfitPriceAndStopLossPriceOfPositionTable1675244220375 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
