import { AdminOrderDto } from './dto/admin-order.dto';
import { OrderEntity } from 'src/models/entities/order.entity';
import { AccountService } from 'src/modules/account/account.service';
import { OrderService } from 'src/modules/order/order.service';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { CANCEL_ORDER_TYPE, ContractType, ORDER_TPSL } from 'src/shares/enums/order.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { OpenOrderDto } from './dto/open-order.dto';
import { OrderHistoryDto } from './dto/order-history.dto';
import { UpdateTpSlOrderDto } from './dto/update-tpsl-order.dto';
export declare class OrderController {
    private readonly orderService;
    private readonly accountService;
    constructor(orderService: OrderService, accountService: AccountService);
    getHistoryOrders(userId: number, paging: PaginationDto, orderHistoryDto: OrderHistoryDto): Promise<ResponseDto<OrderEntity[]>>;
    getAllOrderAdmin(paging: PaginationDto, queries: AdminOrderDto): Promise<ResponseDto<OrderEntity[]>>;
    getOneOrder(userId: number, orderId: number): Promise<OrderEntity>;
    getAllOrder(paging: PaginationDto, userId: number, openOrderDto: OpenOrderDto): Promise<ResponseDto<OrderEntity[]>>;
    createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<ResponseDto<OrderEntity>>;
    cancelOrderByType(userId: number, type: CANCEL_ORDER_TYPE, contractType: ContractType): Promise<ResponseDto<OrderEntity[]>>;
    getRootOrder(userId: number, orderId: number, type: ORDER_TPSL): Promise<ResponseDto<OrderEntity>>;
    cancelOrder(orderId: number, userId: number): Promise<ResponseDto<OrderEntity>>;
    getTpSlOrder(rootOrderId: number): Promise<{
        data: import("@nestjs/common").HttpException | {
            rootOrder: OrderEntity;
            tpOrder: OrderEntity;
            slOrder: OrderEntity;
        };
    }>;
    updateTpSlOrder(userId: number, updateTpSlOrderDto: UpdateTpSlOrderDto[], rootOrderId: number): Promise<{
        data: void;
    }>;
}
