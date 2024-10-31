import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { GroupMemberConvertor } from 'src/core/convertors/group-members/group-members.convertor';
import { GroupMemberReqDto } from 'src/core/dto/group-members/group.req-dto';
import { GroupMemberResDto } from 'src/core/dto/group-members/group.res-dto';

import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class GroupMemberUsecase {
  constructor(
    private dataService: IDataServices,
    private convertor: GroupMemberConvertor,
  ) {}

  async create(dto: GroupMemberReqDto): Promise<IResponse<GroupMemberResDto>> {
    const entity = this.convertor.toEntityFromDto(dto);
    const createdEntity = await this.dataService.groupMembers.create(entity);
    return {
      data: this.convertor.toResDtoFromEntity(createdEntity),
      message: MESSAGES.GROUP_MEMBERS.CREATE.SUCCESS,
    };
  }

  async getAll(groupId: number): Promise<IResponse<GroupMemberResDto[]>> {
    const entities = await this.dataService.groupMembers.getAllByProperties({
      groupId,
    });
    return {
      data: entities.map((entity) => this.convertor.toResDtoFromEntity(entity)),
      message: MESSAGES.GROUP_MEMBERS.GET_ALL.SUCCESS,
    };
  }

  async delete(membershipId: number): Promise<IResponse<null>> {
    await this.dataService.groupMembers.delete(membershipId);
    return {
      data: null,
      message: MESSAGES.GROUP_MEMBERS.DELETE.SUCCESS,
    };
  }
}
