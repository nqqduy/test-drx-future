import { AdminOrderDto } from './dto/admin-order.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderEntity } from 'src/models/entities/order.entity';
import { AccountService } from 'src/modules/account/account.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { OrderService } from 'src/modules/order/order.service';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { CANCEL_ORDER_TYPE, ContractType, ORDER_TPSL } from 'src/shares/enums/order.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { OpenOrderDto } from './dto/open-order.dto';
import { OrderHistoryDto } from './dto/order-history.dto';
import { UpdateTpSlOrderDto } from './dto/update-tpsl-order.dto';
import { JwtAdminGuard } from '../auth/guards/jwt.admin.guard';
@Controller('order')
@ApiTags('Order')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService, private readonly accountService: AccountService) {}

  @Post('/history')
  @UseGuards(JwtAuthGuard)
  async getHistoryOrders(
    @UserID() userId: number,
    @Query() paging: PaginationDto,
    @Body() orderHistoryDto: OrderHistoryDto,
  ): Promise<ResponseDto<OrderEntity[]>> {
    //const account = await this.accountService.getFirstAccountByOwnerId(userId);
    const response = await this.orderService.getHistoryOrders(userId, paging, orderHistoryDto);
    return response;
  }

  @Get()
  @UseGuards(JwtAdminGuard)
  async getAllOrderAdmin(
    @Query() paging: PaginationDto,
    @Query() queries: AdminOrderDto,
  ): Promise<ResponseDto<OrderEntity[]>> {
    const response = await this.orderService.getOrderByAdmin(paging, queries);
    return response;
  }

  @Get('/my-order/:orderId')
  @UseGuards(JwtAuthGuard)
  async getOneOrder(@UserID() userId: number, @Param('orderId') orderId: number): Promise<OrderEntity> {
    const response = await this.orderService.getOneOrder(orderId, userId);
    return response;
  }

  @Post('/open')
  @UseGuards(JwtAuthGuard)
  async getAllOrder(
    @Query() paging: PaginationDto,
    @UserID() userId: number,
    @Body() openOrderDto: OpenOrderDto,
  ): Promise<ResponseDto<OrderEntity[]>> {
    //const account = await this.accountService.getFirstAccountByOwnerId(userId);
    const response = await this.orderService.getOpenOrderByAccountId(paging, userId, openOrderDto);
    return response;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: `
    When place:
    Limit order: type = "LIMIT", tpSLType = ""
    Market order: type = "MARKET", tpSLType = ""
    Stop limit order: type = "LIMIT", tpSLType = "STOP_LIMIT", tpSLPrice, stopCondition, trigger
    Stop market order: type = "MARKET", tpSLType = "STOP_MARKET", tpSLPrice, stopCondition, trigger
    Trailing stop order: type = "MARKET", tpSLType = "TRAILING_STOP", stopCondition, activationPrice, callbackRate,
    Post only order: isPostOnly = true
    `,
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @UserID() userId: number,
  ): Promise<ResponseDto<OrderEntity>> {
    const account = await this.accountService.getFirstAccountByOwnerId(userId, createOrderDto.asset);
    const validatedCreateOrder = await this.orderService.validateOrder(createOrderDto);
    return {
      data: await this.orderService.createOrder(validatedCreateOrder, {
        accountId: account.id,
        userId,
        email: account.userEmail,
      }),
    };
  }

  @Delete('/cancel-order')
  @UseGuards(JwtAuthGuard)
  async cancelOrderByType(
    @UserID() userId: number,
    @Query('type') type: CANCEL_ORDER_TYPE,
    @Query('contractType') contractType: ContractType,
  ): Promise<ResponseDto<OrderEntity[]>> {
    //const account = await this.accountService.getFirstAccountByOwnerId(userId);
    const canceledOrders = await this.orderService.cancelAllOrder(userId, type, contractType);
    return {
      data: canceledOrders,
    };
  }

  @Get('/get-root-order')
  @UseGuards(JwtAuthGuard)
  async getRootOrder(
    @UserID() userId: number,
    @Query('orderId') orderId: number,
    @Query('type') type: ORDER_TPSL,
  ): Promise<ResponseDto<OrderEntity>> {
    const account = await this.accountService.getFirstAccountByOwnerId(userId);
    const canceledOrders = await this.orderService.getRootOrder(account.id, orderId, type);
    return {
      data: canceledOrders,
    };
  }
  @Delete('/:orderId')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Param('orderId') orderId: number, @UserID() userId: number): Promise<ResponseDto<OrderEntity>> {
    //const account = await this.accountService.getFirstAccountByOwnerId(userId);
    const canceledOrder = await this.orderService.cancelOrder(orderId, userId);
    return {
      data: canceledOrder,
    };
  }

  @Get('/tp-sl/:rootOrderId')
  @UseGuards(JwtAuthGuard)
  async getTpSlOrder(@Param('rootOrderId') rootOrderId: number) {
    const orders = await this.orderService.getTpSlOrder(rootOrderId);
    return {
      data: orders,
    };
  }

  @Put('/tp-sl/:rootOrderId')
  @UseGuards(JwtAuthGuard)
  async updateTpSlOrder(
    @UserID() userId: number,
    @Body() updateTpSlOrderDto: UpdateTpSlOrderDto[],
    @Param('rootOrderId') rootOrderId: number,
  ) {
    // const account = await this.accountService.getFirstAccountByOwnerId(userId);
    const orders = await this.orderService.updateTpSlOrder(userId, updateTpSlOrderDto, rootOrderId);
    return {
      data: orders,
    };
  }
}
