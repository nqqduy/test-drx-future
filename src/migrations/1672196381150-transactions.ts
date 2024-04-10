import { MigrationInterface, QueryRunner } from 'typeorm';

export class transactions1672196381150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('transactions', ['logIndex', 'operationId', 'asset', 'txHash']);
  }

  public async down(): Promise<void> {}
}
