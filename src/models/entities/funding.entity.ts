import { Expose, Transform } from 'class-transformer';
import { dateTransformer } from 'src/shares/helpers/transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'fundings',
})
export class FundingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose()
  symbol: string;

  @Column()
  @Transform(dateTransformer)
  time: Date;

  @Column()
  @Expose()
  fundingInterval: string;

  @Column()
  @Expose()
  fundingRateDaily: string;

  @Column()
  @Expose()
  fundingRate: string;

  @Column()
  @Expose()
  oraclePrice: string;

  @Column()
  @Expose()
  paid: boolean;

  @Column()
  @Expose()
  nextFunding: number;

  @CreateDateColumn()
  @Transform(dateTransformer)
  createdAt: Date;

  @UpdateDateColumn()
  @Transform(dateTransformer)
  updatedAt: Date;
}
