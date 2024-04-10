import { IndexService } from './index.service';
export declare class IndexController {
    private readonly indexService;
    constructor(indexService: IndexService);
    fakeMarkPrice(markPrice: number, symbol: string): Promise<string>;
}
