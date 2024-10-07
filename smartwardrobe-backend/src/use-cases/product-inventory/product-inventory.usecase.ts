import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { ProductInventoryConvertor } from 'src/core/convertors/product-inventory/product-inventory.convertor';
import { ProductInventoryReqDto } from 'src/core/dto/product-inventory/product-inventory-req-dto';
import { UpdateProductInventoryCategoryReqDto } from 'src/core/dto/product-inventory/product-inventory-req-update-dto';
import { ProductInventoryResDto } from 'src/core/dto/product-inventory/product-inventory-res-dto';
import { ProductInventoryEntity } from 'src/core/entities/product-inventory/product-inventory.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class ProductInventoryUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: ProductInventoryConvertor,
  ) {}

  async create(
    dto: ProductInventoryReqDto,
  ): Promise<IResponse<ProductInventoryResDto>> {
    try {
      const productInventoryEntity: ProductInventoryEntity =
        this.convertor.toProductModelFromDto(dto);
      const entity: ProductInventoryEntity =
        await this.databaseService.productInventory.create(
          productInventoryEntity,
        );
      const data: ProductInventoryResDto =
        this.convertor.toProductResDtoFromEntity(entity);
      return {
        data,
        message: MESSAGES.PRODUCT_CATEGORY.CREATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<IResponse<ProductInventoryResDto[]>> {
    try {
      const entities: ProductInventoryEntity[] =
        await this.databaseService.productInventory.getAll();

      const data: ProductInventoryResDto[] =
        this.convertor.toProductResDtoFromEntities(entities);

      return {
        data,
        message: MESSAGES.PRODUCT_CATEGORY.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    dto: UpdateProductInventoryCategoryReqDto,
  ): Promise<IResponse<ProductInventoryResDto>> {
    try {
      const { id } = dto;

      const productEntity: ProductInventoryEntity =
        this.convertor.toUpdateProductModelFromDto(dto);

      await this.databaseService.productInventory.update(id, productEntity);

      return {
        data: null,
        message: MESSAGES.PRODUCT_CATEGORY.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<IResponse<null>> {
    try {
      await this.databaseService.productInventory.delete(id);
      return {
        data: null,
        message: MESSAGES.PRODUCT_CATEGORY.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number): Promise<IResponse<ProductInventoryResDto>> {
    try {
      const data: ProductInventoryEntity =
        await this.databaseService.productInventory.get(id);
      return {
        data,
        message: MESSAGES.PRODUCT_INVENTORY.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
