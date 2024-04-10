import { OrderEntity } from 'src/models/entities/order.entity';
import { BaseRepository } from 'src/models/repositories/base.repository';
import { OrderHistoryDto } from 'src/modules/order/dto/order-history.dto';
import { CANCEL_ORDER_TYPE, ContractType, OrderStatus } from 'src/shares/enums/order.enum';
import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
export declare class OrderRepository extends BaseRepository<OrderEntity> {
    findOrderBatch(status: OrderStatus, fromId: number, count: number): Promise<OrderEntity[]>;
    findAccountOrderBatch(userId: number, status: OrderStatus, fromId: number, count: number, types: string[], cancelOrderType: CANCEL_ORDER_TYPE, contractType: ContractType): Promise<OrderEntity[]>;
    getLastId(): Promise<number>;
    genQueryGetOrderHistory(orderHistoryDto: OrderHistoryDto, startTime: string, endTime: string, userId: number, offset: number, limit: number): Promise<{
        orders: OrderEntity[];
        count: number;
    }>;
    getOrderHistory(orderHistoryDto: OrderHistoryDto, startTime: string, endTime: string, userId: number, paging: PaginationDto): Promise<{
        orders: OrderEntity[];
        count: number;
    }>;
    genQueryGetPartiallyFilledOrder(orderHistoryDto: OrderHistoryDto, startTime: string, endTime: string, query: SelectQueryBuilder<OrderEntity>, userId: number): Promise<void>;
}
