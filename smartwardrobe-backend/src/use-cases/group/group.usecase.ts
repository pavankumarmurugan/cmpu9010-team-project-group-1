import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { GroupConvertor } from 'src/core/convertors/group/group.convertor';
import { UserDtoConvertor } from 'src/core/convertors/user/user-dto.convertor';
import { GroupReqDto } from 'src/core/dto/group/group.req-dto';
import { UpdateGroupDto } from 'src/core/dto/group/group.req-update-dto';
import { GroupResDto } from 'src/core/dto/group/group.res-dto';
import { GroupMembersEntity } from 'src/core/entities/group-members/group-members.entity';
import { GroupEntity } from 'src/core/entities/group/group';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { FirebaseService } from 'src/infrastructure/services/firebase/firebase.service';

@Injectable()
export class GroupUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: GroupConvertor,
    private userDtoConvertor: UserDtoConvertor,
    private firebaseService: FirebaseService,
  ) {}

  async create(
    userId: number,
    dto: GroupReqDto,
  ): Promise<IResponse<GroupEntity>> {
    try {
      const groupEntity: GroupEntity = this.convertor.fromCreateDtoToEntity(
        userId,
        dto,
      );

      const entity: GroupEntity =
        await this.databaseService.group.create(groupEntity);
      const data: GroupEntity = this.convertor.toEntity(entity);

      // await this.firebaseService.addGroupChatNotification(
      //   senderId,
      //   receiverId,
      //   chatId,
      //   groupId,
      //   groupName,
      //   message,
      // );

      return {
        data,
        message: MESSAGES.GROUP.CREATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll(userId: number): Promise<IResponse<GroupResDto[]>> {
    try {
      const groupMembersEntities: GroupMembersEntity[] =
        await this.databaseService.groupMembers.getAllByProperties({ userId });

      const entities: GroupEntity[] = await Promise.all(
        groupMembersEntities.map(({ groupId }) =>
          this.databaseService.group.get({ groupId }),
        ),
      );
      const data = this.convertor.toEntityWithMembershipId(
        entities,
        groupMembersEntities,
      );

      return {
        data,
        message: MESSAGES.GROUP.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    userId: number,
    dto: UpdateGroupDto,
  ): Promise<IResponse<GroupEntity>> {
    try {
      const { groupId } = dto;
      const { createdBy }: GroupEntity = await this.databaseService.group.get({
        groupId,
      });

      if (createdBy !== userId) {
        throw new UnauthorizedException(MESSAGES.GROUP.UPDATE.UNAUTHORIZED);
      }

      const groupEntity: GroupEntity =
        this.convertor.fromUpdateDtoToEntity(dto);
      await this.databaseService.group.update(groupId, groupEntity);
      const updatedEntity: GroupEntity = await this.databaseService.group.get({
        groupId,
      });
      const data: GroupEntity = this.convertor.toEntity(updatedEntity);
      return {
        data,
        message: MESSAGES.GROUP.UPDATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(groupId: number): Promise<IResponse<null>> {
    try {
      await this.databaseService.group.delete(groupId);
      return {
        data: null,
        message: MESSAGES.GROUP.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOne(groupId: number): Promise<IResponse<GroupEntity>> {
    try {
      const entity: GroupEntity = await this.databaseService.group.get({
        groupId,
      });
      const data: GroupEntity = this.convertor.toEntity(entity);
      return {
        data,
        message: MESSAGES.GROUP.GET_ONE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllMembersInGroup(
    groupId: number,
  ): Promise<IResponse<GroupEntity> | any> {
    const groupMembersEntity: GroupMembersEntity[] =
      await this.databaseService.groupMembers.getAllByProperties({ groupId });

    const userEntity: UserEntity[] = await Promise.all(
      groupMembersEntity.map(({ userId }) =>
        this.databaseService.users.get({ userId }),
      ),
    );

    const data = this.userDtoConvertor.toUserResDTOFromEntity(userEntity);

    return {
      data,
      message: MESSAGES.GROUP.GET_ALL_MEMBERS_IN_GROUP.SUCCESS,
    };
  }
}
