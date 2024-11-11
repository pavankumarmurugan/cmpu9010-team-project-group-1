import { BadRequestException, Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { UserLikedModelConverter } from 'src/core/convertors/user-liked-models/user-liked-models.convertor';
import { UserLikedModelRequestDTO } from 'src/core/dto/user-liked-models/user-liked-models-req.dto';
import { UserLikedModelResponseDTO } from 'src/core/dto/user-liked-models/user-liked-models-res.dto';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class UserLikedModelUsecase {
  constructor(
    private readonly databaseService: IDataServices,
    private readonly likedModelConverter: UserLikedModelConverter,
  ) {}

  async create(
    userId: number,
    userLikedModelDTO: UserLikedModelRequestDTO,
  ): Promise<IResponse<UserLikedModelResponseDTO>> {
    try {
      const entity = this.likedModelConverter.toEntity(
        userId,
        userLikedModelDTO,
      );
      const savedEntity =
        await this.databaseService.userLikedModel.create(entity);
      const data = this.likedModelConverter.toDTO(savedEntity);

      return {
        data,
        message: MESSAGES.USER_LIKED_MODEL.CREATE.SUCCESS,
      };
    } catch (error) {
      throw new BadRequestException(
        MESSAGES.USER_LIKED_MODEL.CREATE.ALREADY_LIKED,
      );
    }
  }

  async getAllByUserId(
    userId: number,
  ): Promise<IResponse<UserLikedModelResponseDTO[]>> {
    try {
      const entities =
        await this.databaseService.userLikedModel.getAllByProperties({
          userId,
        });

      const data = this.likedModelConverter.toResponseDto(entities);

      return {
        data,
        message: MESSAGES.USER_LIKED_MODEL.GET_ALL.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<IResponse<null>> {
    try {
      await this.databaseService.userLikedModel.delete(id);

      return {
        data: null,
        message: MESSAGES.USER_LIKED_MODEL.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}
