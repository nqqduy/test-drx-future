import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { TradingRulesModeDto } from './dto/trading-rules.dto';
import { TradingRulesService } from './trading-rule.service';
export declare class TradingRulesController {
    private readonly tradingRulesService;
    constructor(tradingRulesService: TradingRulesService);
    updateMarginMode(input: TradingRulesModeDto): Promise<{
        data: import("../../models/entities/trading_rules.entity").TradingRulesEntity;
    }>;
    getTradingRuleByInstrumentId(symbol: string): Promise<{
        data: unknown;
    }>;
    getAllTradingRules(input: PaginationDto): Promise<{
        data: {
            list: any[];
            count: number;
        };
    }>;
}
