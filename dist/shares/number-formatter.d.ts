import { InstrumentEntity } from 'src/models/entities/instrument.entity';
export declare function formatPrice(number: string | undefined, instrument: InstrumentEntity | undefined, zeroValue?: string): string;
export declare function formatQuantity(number: string | undefined, instrument: InstrumentEntity | undefined, zeroValue?: string): string;
export declare function formatOrderEnum(value: string | undefined): string;
export declare function getValueClassName(value: string | undefined, positiveClass?: string, neutralClass?: string, negativeClass?: string): string;
export declare const formatUSDAmount: (amount: string | undefined) => string;
export declare const isNumber: (str: string) => boolean;
export declare const formatPercent: (percent: string | number, precision?: number) => string;
export declare const formatNumberDecimal: (number: string | number) => string;
