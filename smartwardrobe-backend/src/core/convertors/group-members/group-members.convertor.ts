// src/core/convertors/group-members/group-member.convertor.ts
import { Injectable } from '@nestjs/common';
import { GroupMemberReqDto } from 'src/core/dto/group-members/group.req-dto';
import { GroupMemberResDto } from 'src/core/dto/group-members/group.res-dto';
import { GroupMembersEntity } from 'src/core/entities/group-members/group-members.entity';

@Injectable()
export class GroupMemberConvertor {
  toEntityFromDto(dto: GroupMemberReqDto): GroupMembersEntity {
    return {
      ...dto,
    };
  }

  toResDtoFromEntity(entity: GroupMembersEntity): GroupMemberResDto {
    return {
      ...entity,
    };
  }

  toModelFromEntity(entity: GroupMembersEntity): GroupMembersEntity {
    return {
      ...entity,
    };
  }
}
