// src/core/convertors/group/group.convertor.ts

import { Injectable } from '@nestjs/common';
import { GroupReqDto } from 'src/core/dto/group/group.req-dto';
import { UpdateGroupDto } from 'src/core/dto/group/group.req-update-dto';
import { GroupEntity } from 'src/core/entities/group/group';
import { GroupModel } from 'src/infrastructure/frameworks/data-services/model/group.model';

@Injectable()
export class GroupConvertor {
  toEntity(model: GroupModel): GroupEntity {
    return { ...model };
  }

  toModel(entity: GroupEntity): GroupModel {
    return { ...entity };
  }

  fromCreateDtoToEntity(userId, dto: GroupReqDto): GroupEntity {
    return {
      ...dto,
      createdBy: userId,
    };
  }

  fromUpdateDtoToEntity(dto: UpdateGroupDto): GroupEntity {
    return {
      ...dto,
      updatedAt: new Date(),
    };
  }

  toResponseDto(entity: GroupEntity) {
    return {
      ...entity,
    };
  }
}
