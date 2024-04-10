import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameColumn1672736625354 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('orders', 'tpSlType', 'tpSLType');
    await queryRunner.renameColumn('orders', 'tpSlPrice', 'tpSLPrice');
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
