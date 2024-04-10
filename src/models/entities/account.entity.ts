import { Expose, Transform } from 'class-transformer';
import { dateTransformer } from 'src/shares/helpers/transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'accounts',
})
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose()
  asset: string;

  @Column()
  @Expose()
  balance: string;

  @Column()
  @Expose()
  userId: number;

  @Column()
  @Expose()
  operationId: number;

  @Column()
  @Expose()
  userEmail: string;

  @CreateDateColumn()
  @Transform(dateTransformer)
  createdAt: Date;

  @UpdateDateColumn()
  @Transform(dateTransformer)
  updatedAt: Date;
}
