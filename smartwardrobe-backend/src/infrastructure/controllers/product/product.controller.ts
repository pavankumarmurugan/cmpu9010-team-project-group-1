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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductReqDto } from 'src/core/dto/product/product-req-dto';
import { ProductReqUpdateDto } from 'src/core/dto/product/product-req-update-dto';
import { ProductResDto } from 'src/core/dto/product/product-res-dto';
import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { ProductUsecase } from 'src/use-cases/product/product.usecase';

@Controller('product')
@ApiTags('Product')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ProductController {
  constructor(private productUsecase: ProductUsecase) {}

  @Get('get-all')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getProductById(): Promise<IResponse<ProductResDto[]>> {
    try {
      return await this.productUsecase.getAllProduct();
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  async create(
    @Body() productReqDto: ProductReqDto,
  ): Promise<IResponse<ProductResDto>> {
    try {
      return await this.productUsecase.create(productReqDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  async update(
    @Body() productReqUpdateDto: ProductReqUpdateDto,
  ): Promise<IResponse<ProductResDto>> {
    try {
      return await this.productUsecase.update(productReqUpdateDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<ProductResDto>> {
    try {
      return await this.productUsecase.delete(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-one/:id')
  @ApiBearerAuth()
  @Roles(ROLES.USER)
  async getOneAddress(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<ProductResDto>> {
    try {
      return await this.productUsecase.getOneAddress(id);
    } catch (error) {
      throw error;
    }
  }
}
