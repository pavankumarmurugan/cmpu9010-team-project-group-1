import { Injectable } from '@nestjs/common';
import { GroupReqDto } from 'src/core/dto/group/group.req-dto';
import { UpdateGroupDto } from 'src/core/dto/group/group.req-update-dto';
import { GroupResDto } from 'src/core/dto/group/group.res-dto';
import { GroupMembersEntity } from 'src/core/entities/group-members/group-members.entity';
import { GroupEntity } from 'src/core/entities/group/group';
import { GroupModel } from 'src/infrastructure/frameworks/data-services/model/group.model';

@Injectable()
export class GroupConvertor {
  toGroupResDtoFromMembers(groupMembers: GroupMembersEntity[]) {
    return groupMembers.map((groupMember) => ({
      membershipId: groupMember.membershipId,
      groupId: groupMember.group?.groupId,
      groupName: groupMember.group?.groupName,
      createdBy: groupMember.group?.createdBy,
      createdAt: groupMember.group?.createdAt,
      updatedAt: groupMember.group?.updatedAt,
    }));
  }
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

  toEntityWithMembershipId(
    entities: GroupModel[],
    groupMembersEntities: GroupMembersEntity[],
  ): GroupResDto[] {
    return entities.map((entity) => {
      const membershipId = groupMembersEntities.find(
        (groupMember) => groupMember.groupId === entity.groupId,
      ).membershipId;
      return {
        ...entity,
        membershipId,
      };
    });
  }

  toGroupResDtoFromMembersAndUsers(groupMembers: GroupMembersEntity[]) {
    return groupMembers.map((groupMember) => ({
      membershipId: groupMember.membershipId,
      groupId: groupMember.group?.groupId,
      groupName: groupMember.group?.groupName,
      createdBy: groupMember.group?.createdBy,
      createdAt: groupMember.group?.createdAt,
      updatedAt: groupMember.group?.updatedAt,
    }));
  }
}
