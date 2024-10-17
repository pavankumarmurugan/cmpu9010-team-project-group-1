import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { CartItemConvertor } from 'src/core/convertors/cart-item/cart-item.convertor';
import { CartConvertor } from 'src/core/convertors/cart/cart.convertor';
import { CartItemResDto } from 'src/core/dto/cart-item/cart-item-res-dto';
import { CartReqDto } from 'src/core/dto/cart/cart-req-dto';
import { UpdateCartReqDto } from 'src/core/dto/cart/cart-req-update-dto';
import { CartResDto } from 'src/core/dto/cart/cart-res-dto';
import { CartItemEntity } from 'src/core/entities/cart-item/cart-item.entity';
import { CartEntity } from 'src/core/entities/cart/cart.entity';
import { ProductEntity } from 'src/core/entities/product/product.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class CartUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: CartConvertor,
    private cartItemConvertor: CartItemConvertor,
  ) {}

  async create(
    userId: number,
    dto: CartReqDto,
  ): Promise<IResponse<CartResDto>> {
    try {
      const cartEntity: CartEntity = this.convertor.toModelFromDto(dto);
      const entity: CartEntity = await this.databaseService.cart.create({
        ...cartEntity,
        userId,
      });
      const data: CartResDto = this.convertor.toResDtoFromEntity(entity);
      return {
        data,
        message: MESSAGES.CART.CREATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<IResponse<CartResDto[]>> {
    try {
      const entities: CartEntity[] = await this.databaseService.cart.getAll();

      const data: CartResDto[] = this.convertor.toResDtoFromEntities(entities);

      return {
        data,
        message: MESSAGES.CART.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(dto: UpdateCartReqDto): Promise<IResponse<CartResDto>> {
    try {
      const { id } = dto;
      const entity: CartEntity = this.convertor.toUpdateModelFromDto(dto);
      await this.databaseService.cart.update(id, entity);
      return {
        data: null,
        message: MESSAGES.CART.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<IResponse<null>> {
    try {
      await this.databaseService.cart.delete(id);
      return {
        data: null,
        message: MESSAGES.CART.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number): Promise<IResponse<CartResDto>> {
    try {
      const data: CartEntity = await this.databaseService.cart.get(id);
      return {
        data,
        message: MESSAGES.CART.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMyCart(id: number): Promise<IResponse<CartItemResDto[]>> {
    try {
      const cartEntity: CartEntity = await this.databaseService.cart.get({
        userId: id,
      });

      const cartItemEntities: CartItemEntity[] =
        await this.databaseService.cartItem.getAllByProperties({
          cartId: cartEntity.id,
        });

      const productIds: number[] = cartItemEntities.map(
        (cartItemEntity) => cartItemEntity.productId,
      );
      const productEntities: ProductEntity[] =
        await this.databaseService.product.getAllByIdsIn(productIds, 'id');
      const data: CartItemResDto[] =
        this.cartItemConvertor.toResDtoFromEntitiesWithProductDetails(
          cartItemEntities,
          productEntities,
        );

      return {
        data,
        message: MESSAGES.CART.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
