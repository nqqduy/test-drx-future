import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class orderPostonly1675760760942 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'isPostOnly',
        type: 'boolean',
        default: '0',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'isPostOnly');
  }
}
