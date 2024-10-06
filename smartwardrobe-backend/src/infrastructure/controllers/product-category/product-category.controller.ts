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
import { ProductCategoryReqDto } from 'src/core/dto/product-category/product-category-req-dto';
import { UpdateProductCategoryReqDto } from 'src/core/dto/product-category/product-category-req-update-dto';
import { ProductCategoryResDto } from 'src/core/dto/product-category/product-category-res-dto';

import { IResponse } from 'src/core/interface/response.interface';
import { Roles } from 'src/domain/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/domain/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/domain/guards/roles/roles.guard';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { ProductCategoryUsecase } from 'src/use-cases/product-category/product-category.usecase';

@Controller('product-category')
@ApiTags('Product-Category')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ProductCategoryController {
  constructor(private usecase: ProductCategoryUsecase) {}

  @Get('get-all')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAll(): Promise<IResponse<ProductCategoryResDto[]>> {
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
    @Body() dto: ProductCategoryReqDto,
  ): Promise<IResponse<ProductCategoryResDto>> {
    try {
      return await this.usecase.create(dto);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  async update(
    @Body() dto: UpdateProductCategoryReqDto,
  ): Promise<IResponse<ProductCategoryResDto>> {
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
  ): Promise<IResponse<ProductCategoryResDto>> {
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
  ): Promise<IResponse<ProductCategoryResDto>> {
    try {
      return await this.usecase.getOne(id);
    } catch (error) {
      throw error;
    }
  }
}
