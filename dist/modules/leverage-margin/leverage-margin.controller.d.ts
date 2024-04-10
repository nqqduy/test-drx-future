import { LeverageMarginEntity } from 'src/models/entities/leverage-margin.entity';
import { LeverageMarginService } from './leverage-margin.service';
import { LeverageMarginDto } from './dto/leverage-margin.dto';
export declare class LeverageMarginController {
    private readonly leverageMarginService;
    constructor(leverageMarginService: LeverageMarginService);
    getAllLeverageMargin(symbol: string): Promise<LeverageMarginEntity[]>;
    upsertLeverageMargin(leverageMarginDto: LeverageMarginDto): Promise<LeverageMarginEntity>;
}
