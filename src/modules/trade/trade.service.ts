import { MAX_RESULT_COUNT } from './trade.const';
import { getQueryLimit } from './../../shares/pagination-util';
import { AdminTradeDto } from './dto/admin-trade.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TradeEntity } from 'src/models/entities/trade.entity';
import { TradeRepository } from 'src/models/repositories/trade.repository';
import { FillDto } from 'src/modules/trade/dto/get-fills.dto';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { TradeHistoryDto } from './dto/trade-history.dto';
import * as moment from 'moment';
import { LessThan, MoreThan, Like, getConnection, IsNull } from 'typeorm';
import { AccountRepository } from 'src/models/repositories/account.repository';
import { AccountEntity } from 'src/models/entities/account.entity';
import { GET_NUMBER_RECORD, START_CRAWL } from '../transaction/transaction.const';
import { UserRepository } from 'src/models/repositories/user.repository';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(TradeRepository, 'master')
    private tradeRepoMaster: TradeRepository,
    @InjectRepository(TradeRepository, 'report')
    private tradeRepoReport: TradeRepository,
    @InjectRepository(AccountRepository, 'report')
    public readonly accountRepoReport: AccountRepository,
    @InjectRepository(AccountRepository, 'master')
    public readonly accountRepoMaster: AccountRepository,
    @InjectRepository(UserRepository, 'report')
    public readonly userRepoReport: UserRepository,
  ) {
    setTimeout(() => {
      this.updateTrade();
    }, 3000);
  }

  async getFillTrade(
    accountId: number,
    paging: PaginationDto,
    tradeHistoryDto: TradeHistoryDto,
  ): Promise<ResponseDto<FillDto[]>> {
    const [fills, totalPage] = await this.tradeRepoReport.getFills(accountId, paging, tradeHistoryDto);
    return {
      data: fills,
      metadata: {
        totalPage: totalPage,
      },
    };
  }

  async getRecentTrades(symbol: string, paging: PaginationDto): Promise<TradeEntity[]> {
    const trades = await this.tradeRepoReport.find({
      select: ['symbol', 'price', 'quantity', 'buyerIsTaker', 'createdAt', 'id'],
      where: {
        symbol,
      },
      take: paging.size,
      order: {
        id: 'DESC',
      },
    });
    return trades;
  }

  async findYesterdayTrade(date: Date, symbol: string | undefined): Promise<TradeEntity | undefined> {
    return this.tradeRepoReport.findYesterdayTrade(date, symbol);
  }

  async findTodayTrades(date: Date, from: number, count: number): Promise<TradeEntity[]> {
    return this.tradeRepoReport.findTodayTrades(date, from, count);
  }

  async getLastTrade(symbol: string): Promise<TradeEntity[]> {
    return this.tradeRepoMaster.getLastTrade(symbol);
  }

  async getLastTradeId(): Promise<number> {
    return await this.tradeRepoMaster.getLastId();
  }

  async getTrades(paging: PaginationDto, queries: AdminTradeDto): Promise<any> {
    const startTime = moment(queries.from).format('YYYY-MM-DD 00:00:00');
    const endTime = moment(queries.to).format('YYYY-MM-DD 23:59:59');
    const commonAndConditions = {
      createdAt: MoreThan(startTime),
      updatedAt: LessThan(endTime),
    };

    if (queries.symbol) {
      commonAndConditions['symbol'] = Like(`%${queries.symbol}%`);
    }
    const { offset, limit } = getQueryLimit(paging, MAX_RESULT_COUNT);
    const query = this.tradeRepoReport
      .createQueryBuilder('tr')
      .select('tr.*')
      .where([commonAndConditions])
      .orderBy('tr.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    const [trades, count] = await Promise.all([query.getRawMany(), query.getCount()]);

    return {
      data: trades,
      metadata: {
        total: count,
        totalPage: Math.ceil(count / paging.size),
      },
    };
  }

  async updateTrade() {
    let skip = START_CRAWL;
    const take = GET_NUMBER_RECORD;
    do {
      const listTrade = await this.tradeRepoMaster.find({
        where: [
          {
            buyUserId: IsNull(),
          },
          {
            sellUserId: IsNull(),
          },
        ],
        skip,
        take,
      });

      skip += take;
      if (listTrade.length) {
        for (const item of listTrade) {
          const getBuyUserId = await getConnection('report')
            .getRepository(AccountEntity)
            .findOne({
              where: {
                id: item.buyAccountId,
              },
            });

          const getSellUserId = await getConnection('report')
            .getRepository(AccountEntity)
            .findOne({
              where: {
                id: item.sellAccountId,
              },
            });
          await this.tradeRepoMaster.update({ buyAccountId: getBuyUserId?.id }, { buyUserId: getBuyUserId?.userId });
          await this.tradeRepoMaster.update(
            { sellAccountId: getSellUserId?.id },
            { sellUserId: getSellUserId?.userId },
          );
          const asset = item.symbol.includes('USDT') ? 'USDT' : 'USD';
          const buyAccountId = await this.accountRepoReport.findOne({
            where: {
              asset: asset.toLowerCase(),
              userId: getBuyUserId?.userId,
            },
          });
          const sellAccountId = await this.accountRepoReport.findOne({
            where: {
              asset: asset.toLowerCase(),
              userId: getSellUserId?.userId,
            },
          });
          await this.tradeRepoMaster.update({ buyUserId: getBuyUserId?.id }, { buyAccountId: buyAccountId?.id });
          await this.tradeRepoMaster.update({ sellUserId: getSellUserId?.id }, { sellAccountId: sellAccountId?.id });
        }
      } else {
        break;
      }
    } while (true);
  }

  async updateTradeEmail() {
    let skip = 0;
    const take = 1000;
    do {
      const tradesUpdate = await this.tradeRepoReport.find({
        where: {
          buyEmail: IsNull(),
          sellEmail: IsNull(),
        },
        skip,
        take,
      });
      skip += take;
      if (tradesUpdate.length > 0) {
        for (const trade of tradesUpdate) {
          const [buyUser, sellUser] = await Promise.all([
            this.userRepoReport.findOne({ where: { id: trade.buyUserId } }),
            this.userRepoReport.findOne({ where: { id: trade.sellUserId } }),
          ]);
          await this.tradeRepoMaster.update(
            { id: trade.id },
            {
              buyEmail: buyUser?.email ? buyUser.email : null,
              sellEmail: sellUser?.email ? sellUser.email : null,
              updatedAt: () => 'trades.updatedAt',
              createdAt: () => 'trades.createdAt',
            },
          );
        }
      } else {
        break;
      }
    } while (true);
  }

  async testUpdateTradeEmail(tradeId: string) {
    const tradesUpdate = await this.tradeRepoReport.findOne({
      where: {
        buyEmail: IsNull(),
        sellEmail: IsNull(),
        id: +tradeId,
      },
    });
    const [buyUser, sellUser] = await Promise.all([
      this.userRepoReport.findOne({ where: { id: tradesUpdate.buyUserId } }),
      this.userRepoReport.findOne({ where: { id: tradesUpdate.sellUserId } }),
    ]);
    await this.tradeRepoMaster.update(
      { id: +tradeId },
      {
        buyEmail: buyUser?.email ? buyUser.email : null,
        sellEmail: sellUser?.email ? sellUser.email : null,
        updatedAt: () => 'trades.updatedAt',
        createdAt: () => 'trades.createdAt',
      },
    );
  }
}
