import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductCategoryResDto } from 'src/core/dto/product-category/product-category-res-dto';

import { IResponse } from 'src/core/interface/response.interface';
import { ProductCategoryUsecase } from 'src/use-cases/product-category/product-category.usecase';

@Controller('product-category')
@ApiTags('Product-Category')
export class ProductCategoryController {
  constructor(private usecase: ProductCategoryUsecase) {}

  @Get('get-all')
  async getAll(): Promise<IResponse<ProductCategoryResDto[]>> {
    try {
      return await this.usecase.getAll();
    } catch (error) {
      throw error;
    }
  }

  //   @Post('create')
  //   @ApiBearerAuth()
  //   @Roles(ROLES.ADMIN)
  //   async create(
  //     @Body() dto: ProductCategoryReqDto,
  //   ): Promise<IResponse<ProductCategoryResDto>> {
  //     try {
  //       return await this.usecase.create(dto);
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   @Patch('update')
  //   @ApiBearerAuth()
  //   @Roles(ROLES.ADMIN)
  //   async update(
  //     @Body() dto: UpdateProductCategoryReqDto,
  //   ): Promise<IResponse<ProductCategoryResDto>> {
  //     try {
  //       return await this.usecase.update(dto);
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   @Delete('delete/:id')
  //   @ApiBearerAuth()
  //   @Roles(ROLES.ADMIN)
  //   async delete(
  //     @Param('id', ParseIntPipe) id: number,
  //   ): Promise<IResponse<ProductCategoryResDto>> {
  //     try {
  //       return await this.usecase.delete(id);
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   @Get('get-one/:id')
  //   @ApiBearerAuth()
  //   @Roles(ROLES.ADMIN, ROLES.USER)
  //   async getOne(
  //     @Param('id', ParseIntPipe) id: number,
  //   ): Promise<IResponse<ProductCategoryResDto>> {
  //     try {
  //       return await this.usecase.getOne(id);
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}
