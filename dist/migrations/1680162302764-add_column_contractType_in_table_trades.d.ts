import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class addColumnContractTypeInTableTrades1680162302764 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
