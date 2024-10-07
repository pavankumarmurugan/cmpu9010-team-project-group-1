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
import { ProductInventoryReqDto } from 'src/core/dto/product-inventory/product-inventory-req-dto';
import { UpdateProductInventoryCategoryReqDto } from 'src/core/dto/product-inventory/product-inventory-req-update-dto';
import { ProductInventoryResDto } from 'src/core/dto/product-inventory/product-inventory-res-dto';
import { IResponse } from 'src/core/interface/response.interface';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { ProductInventoryUsecase } from 'src/use-cases/product-inventory/product-inventory.usecase';

@Controller('product-inventory')
@ApiTags('Product-Inventory')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ProductInventoryController {
  constructor(private usecase: ProductInventoryUsecase) {}

  @Get('get-all')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  async getAll(): Promise<IResponse<ProductInventoryResDto[]>> {
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
    @Body() dto: ProductInventoryReqDto,
  ): Promise<IResponse<ProductInventoryResDto>> {
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
    @Body() dto: UpdateProductInventoryCategoryReqDto,
  ): Promise<IResponse<ProductInventoryResDto>> {
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
  ): Promise<IResponse<ProductInventoryResDto>> {
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
  ): Promise<IResponse<ProductInventoryResDto>> {
    try {
      return await this.usecase.getOne(id);
    } catch (error) {
      throw error;
    }
  }
}
