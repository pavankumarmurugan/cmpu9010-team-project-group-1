import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CartItemResDto } from 'src/core/dto/cart-item/cart-item-res-dto';
import { CartReqDto } from 'src/core/dto/cart/cart-req-dto';
import { UpdateCartReqDto } from 'src/core/dto/cart/cart-req-update-dto';
import { CartResDto } from 'src/core/dto/cart/cart-res-dto';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { CartUsecase } from 'src/use-cases/cart/cart.usecase';

@Controller('cart')
@ApiTags('Cart')
@UseGuards(AccessTokenGuard, RolesGuard)
export class CartController {
  constructor(private usecase: CartUsecase) {}

  @Get('get-all')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  async getAll(): Promise<IResponse<CartResDto[]>> {
    try {
      return await this.usecase.getAll();
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  async create(
    @Request() request: RequestWithUser,
    @Body() dto: CartReqDto,
  ): Promise<IResponse<CartResDto>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.usecase.create(userId, dto);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  async update(@Body() dto: UpdateCartReqDto): Promise<IResponse<CartResDto>> {
    try {
      return await this.usecase.update(dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<CartResDto>> {
    try {
      return await this.usecase.delete(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-one/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<CartResDto>> {
    try {
      return await this.usecase.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-my-cart')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getMyCart(
    @Request() request: RequestWithUser,
  ): Promise<IResponse<CartItemResDto[]>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.usecase.getMyCart(userId);
    } catch (error) {
      throw error;
    }
  }
}
