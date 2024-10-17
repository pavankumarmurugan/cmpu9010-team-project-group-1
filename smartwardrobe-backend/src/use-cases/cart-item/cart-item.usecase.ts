import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { CartItemConvertor } from 'src/core/convertors/cart-item/cart-item.convertor';
import { CartItemReqDto } from 'src/core/dto/cart-item/cart-item-req-dto';
import { UpdateCartItemReqDto } from 'src/core/dto/cart-item/cart-item-req-update-dto';
import { CartItemResDto } from 'src/core/dto/cart-item/cart-item-res-dto';
import { CartItemEntity } from 'src/core/entities/cart-item/cart-item.entity';
import { CartEntity } from 'src/core/entities/cart/cart.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class CartItemUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: CartItemConvertor,
  ) {}

  async create(
    userId: number,
    dto: CartItemReqDto,
  ): Promise<IResponse<CartItemResDto>> {
    try {
      const { id }: CartEntity =
        await this.databaseService.cart.get<CartEntity>({ userId });
      const cartItemEntity: CartItemEntity = this.convertor.toModelFromDto(
        id,
        dto,
      );
      const entity: CartItemEntity = await this.databaseService.cartItem.create(
        cartItemEntity,
      );
      const data: CartItemResDto = this.convertor.toResDtoFromEntity(entity);
      return {
        data,
        message: MESSAGES.CART_ITEMS.CREATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll(userId: number): Promise<IResponse<CartItemResDto[]>> {
    try {
      const { id }: CartEntity =
        await this.databaseService.cart.get<CartEntity>({ userId });
      const entities: CartItemEntity[] =
        await this.databaseService.cartItem.getAllByProperties({ cartId: id });

      const data: CartItemResDto[] =
        this.convertor.toResDtoFromEntities(entities);

      return {
        data,
        message: MESSAGES.CART_ITEMS.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(dto: UpdateCartItemReqDto): Promise<IResponse<CartItemResDto>> {
    try {
      const { id } = dto;
      const entity: CartItemEntity = this.convertor.toUpdateModelFromDto(dto);
      await this.databaseService.cartItem.update(id, entity);
      return {
        data: null,
        message: MESSAGES.CART_ITEMS.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<IResponse<null>> {
    try {
      await this.databaseService.cartItem.delete(id);
      return {
        data: null,
        message: MESSAGES.CART_ITEMS.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: number): Promise<IResponse<CartItemResDto>> {
    try {
      const data: CartItemEntity = await this.databaseService.cartItem.get(id);
      return {
        data,
        message: MESSAGES.CART_ITEMS.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
