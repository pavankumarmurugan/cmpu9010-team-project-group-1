import { UserLikedModelRequestDTO } from 'src/core/dto/user-liked-models/user-liked-models-req.dto';
import { UserLikedModelResponseDTO } from 'src/core/dto/user-liked-models/user-liked-models-res.dto';
import { UserLikedModelsEntity } from 'src/core/entities/user-liked-model/user-liked-model.entity';

export class UserLikedModelConverter {
  toResponseDto(entities: UserLikedModelsEntity[]) {
    return entities.map((entity) => ({
      id: entity.id,
      userId: entity.userId,
      modelImageName: entity.modelImageName,
      modelImageUrl: entity.modelImageUrl,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
    }));
  }

  toDTO(model: UserLikedModelsEntity): UserLikedModelResponseDTO {
    return { ...model };
  }

  toEntity(
    userId: number,
    dto: UserLikedModelRequestDTO,
  ): UserLikedModelsEntity {
    return {
      ...dto,
      userId,
    };
  }
}
