import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetsRepository } from 'src/models/repositories/assets.repository';
import { Cache } from 'cache-manager';
import { ASSETS_TTL } from './assets.constants';
import { ContractType } from 'src/shares/enums/order.enum';
import { AssetType, LIST_SYMBOL_COINM, LIST_SYMBOL_USDM } from '../transaction/transaction.const';
import { InstrumentRepository } from 'src/models/repositories/instrument.repository';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(AssetsRepository, 'report')
    public readonly assetsRepoReport: AssetsRepository,
    @InjectRepository(AssetsRepository, 'master')
    public readonly assetsRepoMaster: AssetsRepository,
    @InjectRepository(InstrumentRepository, 'report')
    public readonly instrumentRepoReport: InstrumentRepository,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAllAssets(contractType: ContractType) {
    if (contractType == ContractType.COIN_M) {
      const assetsCache = await this.cacheManager.get<string[]>(AssetType.COIN_M);
      if (assetsCache?.length > 0) {
        return assetsCache;
      }
      await this.cacheManager.set(AssetType.COIN_M, LIST_SYMBOL_COINM, { ttl: ASSETS_TTL });
      return LIST_SYMBOL_COINM;
    }
    const assetsCache = await this.cacheManager.get<string[]>(AssetType.USD_M);
    if (assetsCache?.length > 0) {
      return assetsCache;
    }
    await this.cacheManager.set(AssetType.USD_M, LIST_SYMBOL_USDM, { ttl: ASSETS_TTL });
    return LIST_SYMBOL_USDM;
  }
}
