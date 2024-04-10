import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/models/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { MailService } from 'src/modules/mail/mail.service';
import { FavoriteMarket } from 'src/modules/user/dto/favorite-market.dto';
import { UpdateFavoriteMarketDto } from 'src/modules/user/dto/update-favorite-market.dto';
import { UserService } from 'src/modules/user/users.service';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { ResponseDto } from 'src/shares/dtos/response.dto';
import { JwtSecretGuard } from '../auth/guards/secret-key.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService, private readonly mailService: MailService) {}

  @Post('/')
  @UseGuards(JwtSecretGuard)
  async insertUser(@Body() body: CreateUserDto): Promise<ResponseDto<UserEntity>> {
    const user = await this.userService.createUser(body);
    return {
      data: user,
    };
  }

  @Get('/favorite')
  @UseGuards(JwtAuthGuard)
  async getFavoriteMarket(@UserID() userId: number): Promise<ResponseDto<FavoriteMarket[]>> {
    const farvoriteMarkets = await this.userService.getUserFavoriteMarket(userId);
    return {
      data: farvoriteMarkets,
    };
  }

  @Post('/favorite')
  @UseGuards(JwtAuthGuard)
  async addFavoriteMarket(
    @UserID() userId: number,
    @Body() updateFavoriteMarketDto: UpdateFavoriteMarketDto,
  ): Promise<ResponseDto<{ symbol: string; isFavorite: boolean }>> {
    const updateResult = await this.userService.updateUserFavoriteMarket(
      userId,
      updateFavoriteMarketDto.symbol,
      updateFavoriteMarketDto.isFavorite,
    );
    return {
      data: updateResult,
    };
  }
}
