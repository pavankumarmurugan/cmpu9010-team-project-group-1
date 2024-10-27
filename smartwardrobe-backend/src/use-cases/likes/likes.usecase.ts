import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { LikesConvertor } from 'src/core/convertors/likes/likes.convertor';
import { LikesReqDto } from 'src/core/dto/likes/likes.req-dto';
import { UpdateLikesReqDto } from 'src/core/dto/likes/likes.req-update-dto';
import { LikesResDto } from 'src/core/dto/likes/likes.res-dto';
import { LikesEntity } from 'src/core/entities/likes/likes.entity';
import { ProductEntity } from 'src/core/entities/product/product.entity';

import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class LikesUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: LikesConvertor,
  ) {}

  async create(
    userId: number,
    dto: LikesReqDto,
  ): Promise<IResponse<LikesResDto>> {
    try {
      const likesEntity: LikesEntity = this.convertor.toLikesModelFromDto(
        userId,
        dto,
      );
      const entity: LikesEntity = await this.databaseService.likes.create(
        likesEntity,
      );
      const data: LikesResDto = this.convertor.toLikesResDtoFromEntity(entity);
      return {
        data,
        message: MESSAGES.LIKES.CREATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll(userId: number): Promise<IResponse<LikesResDto[]>> {
    try {
      const entities: LikesEntity[] =
        await this.databaseService.likes.getAllByProperties({
          userId,
        });

      const dto: LikesResDto[] =
        this.convertor.toLikesResDtoFromEntities(entities);

      const productIds: number[] = dto.map((item) => item.productId);

      const products: ProductEntity[] = await Promise.all(
        productIds.map((id) => this.databaseService.product.get({ id })),
      );

      const data: LikesResDto[] =
        this.convertor.toLikesResDtoFromProductAndLikesEntities(
          products,
          entities,
        );

      return {
        data,
        message: MESSAGES.LIKES.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(dto: UpdateLikesReqDto): Promise<IResponse<LikesResDto>> {
    try {
      const { id } = dto;

      const productEntity: LikesEntity =
        this.convertor.toLikesProductModelFromDto(dto);

      await this.databaseService.likes.update(id, productEntity);

      return {
        data: null,
        message: MESSAGES.LIKES.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<IResponse<null>> {
    try {
      await this.databaseService.likes.delete(id);
      return {
        data: null,
        message: MESSAGES.LIKES.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number): Promise<IResponse<LikesResDto>> {
    try {
      const data: LikesEntity = await this.databaseService.likes.get({ id });
      return {
        data,
        message: MESSAGES.PRODUCT_INVENTORY.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
