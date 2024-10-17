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
import { CartItemReqDto } from 'src/core/dto/cart-item/cart-item-req-dto';
import { UpdateCartItemReqDto } from 'src/core/dto/cart-item/cart-item-req-update-dto';
import { CartItemResDto } from 'src/core/dto/cart-item/cart-item-res-dto';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { CartItemUsecase } from 'src/use-cases/cart-item/cart-item.usecase';

@Controller('cart-item')
@ApiTags('Cart Item')
@UseGuards(AccessTokenGuard, RolesGuard)
export class CartItemController {
  constructor(private usecase: CartItemUsecase) {}

  @Get('get-all')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAll(
    @Request() request: RequestWithUser,
  ): Promise<IResponse<CartItemResDto[]>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.usecase.getAll(userId);
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async create(
    @Request() request: RequestWithUser,
    @Body() dto: CartItemReqDto,
  ): Promise<IResponse<CartItemResDto>> {
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
  @Roles(ROLES.ADMIN, ROLES.USER)
  async update(
    @Body() dto: UpdateCartItemReqDto,
  ): Promise<IResponse<CartItemResDto>> {
    try {
      return await this.usecase.update(dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<CartItemResDto>> {
    try {
      return await this.usecase.delete(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-one/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<CartItemResDto>> {
    try {
      return await this.usecase.getOne(id);
    } catch (error) {
      throw error;
    }
  }
}
