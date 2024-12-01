import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetFiltersResponseDto } from 'src/core/dto/filters/get-filters-response.dto';
import { FilterProductsDto } from 'src/core/dto/filters/get-filters.request.dto';
import { ProductResDto } from 'src/core/dto/product/product-res-dto';
import { PaginatedResponse } from 'src/core/interface/paginated.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { FiltersUsecase } from 'src/use-cases/filters/filters.usecase';

@Controller('filters')
@ApiTags('Filters')
export class FiltersController {
  constructor(private readonly usecase: FiltersUsecase) {}
  @Get('get-all-my-filters')
  async getAll(): Promise<IResponse<GetFiltersResponseDto>> {
    try {
      return await this.usecase.getAll();
    } catch (error) {
      throw error;
    }
  }

  @Get('')
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, example: 200 })
  @ApiQuery({ name: 'color', required: false, type: String, example: 'Black' })
  @ApiQuery({
    name: 'material',
    required: false,
    type: String,
    example: 'Cotton',
  })
  @ApiQuery({
    name: 'occasion',
    required: false,
    type: String,
    example: 'Casual',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    example: 'Ladieswear',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    example: 'Top',
  })
  @ApiQuery({
    name: 'trail',
    required: false,
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'pattern',
    required: false,
    type: String,
    example: 'Stripes',
  })
  async filterProducts(
    @Query() filterProductsDto: FilterProductsDto,
  ): Promise<IResponse<PaginatedResponse<ProductResDto[]>>> {
    const {
      page,
      limit,
      minPrice,
      maxPrice,
      color,
      material,
      occasion,
      category,
      type,
      trail,
      pattern,
    } = filterProductsDto;

    return await this.usecase.filterByPriceAndColor(
      page,
      limit,
      minPrice,
      maxPrice,
      color,
      material,
      occasion,
      category,
      type,
      trail,
      pattern,
    );
  }
}
