import { Injectable } from '@nestjs/common';
import { VtoImageSearchResDto } from 'src/core/dto/vto/vto.res-dto';
import { VtoImageSearchEntity } from 'src/core/entities/vto/vto.entity';

@Injectable()
export class VtoImageSearchConvertor {
  toResDtoFromEntity(entity: VtoImageSearchEntity): VtoImageSearchResDto {
    return {
      ...entity,
    };
  }
}
