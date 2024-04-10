import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTradingRulesTable1680601120453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('trading_rules', 'minOrderPrice', 'minOrderAmount');
    await queryRunner.renameColumn('trading_rules', 'maxOrderPrice', 'maxOrderAmount');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('trading_rules', 'minOrderAmount');
    await queryRunner.dropColumn('trading_rules', 'maxOrderAmount');
  }
}
