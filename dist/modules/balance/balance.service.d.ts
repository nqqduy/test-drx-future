import { PositionService } from '../position/position.service';
import { OrderService } from '../order/order.service';
import { AccountService } from '../account/account.service';
import { AssetTokenDto } from '../account/dto/assets.dto';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { AccountEntity } from 'src/models/entities/account.entity';
import { PositionRepository } from 'src/models/repositories/position.repository';
import { UserRepository } from 'src/models/repositories/user.repository';
import { IndexService } from '../index/index.service';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
import { OrderRepository } from 'src/models/repositories/order.repository';
export declare class BalanceService {
    readonly indexService: IndexService;
    readonly positionService: PositionService;
    readonly positionRepoReport: PositionRepository;
    readonly userRepoReport: UserRepository;
    readonly orderRepoReport: OrderRepository;
    readonly instrumentRepoReport: InstrumentRepository;
    readonly orderService: OrderService;
    readonly accountService: AccountService;
    readonly accountRepoReport: AccountRepository;
    readonly accountRepoMaster: AccountRepository;
    constructor(indexService: IndexService, positionService: PositionService, positionRepoReport: PositionRepository, userRepoReport: UserRepository, orderRepoReport: OrderRepository, instrumentRepoReport: InstrumentRepository, orderService: OrderService, accountService: AccountService, accountRepoReport: AccountRepository, accountRepoMaster: AccountRepository);
    getUserBalance(userId: number): Promise<AccountEntity[]>;
    getAssets(userId: number): Promise<{
        assets: AssetTokenDto[];
        totalWalletBalance: string;
    }>;
    formatAccountBeforeResponse(account: any): Promise<any>;
    calAvailableBalance(walletBalance: string, accountId: number, asset: string): Promise<{
        availableBalance: string;
        orderMargin: any;
        positionMargin: string;
        unrealizedPNL: string;
        positionMarginCross: string;
        positionMarginIsolate: string;
    }>;
    convertTokenToUSd(): Promise<void>;
    convertTokenToBTC(): Promise<void>;
    getInforBalance(userId: number, asset?: string): Promise<{}>;
    private getInforBalanceBySymbol;
    private getSymbolOfAsset;
    private calOrderMargin;
    getTotalUserBalances(): Promise<any[]>;
}
