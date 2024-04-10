import { InstrumentEntity } from './instrument.entity';
export declare class MarketFeeEntity {
    id: number;
    instrumentId: number;
    makerFee: string;
    takerFee: string;
    instrument: InstrumentEntity;
    createdAt: Date;
    updatedAt: Date;
}
