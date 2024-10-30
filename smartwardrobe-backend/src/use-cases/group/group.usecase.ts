import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { GroupConvertor } from 'src/core/convertors/group/group.convertor';
import { GroupReqDto } from 'src/core/dto/group/group.req-dto';
import { UpdateGroupDto } from 'src/core/dto/group/group.req-update-dto';
import { GroupEntity } from 'src/core/entities/group/group';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class GroupUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: GroupConvertor,
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
      return {
        data,
        message: MESSAGES.GROUP.CREATE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll(userId: number): Promise<IResponse<GroupEntity[]>> {
    try {
      const entities: GroupEntity[] =
        await this.databaseService.group.getAllByProperties({
          createdBy: userId,
        });
      const data: GroupEntity[] = entities.map((entity) =>
        this.convertor.toEntity(entity),
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

  // async getByUser(userId: number): Promise<IResponse<GroupEntity[]>> {
  //   try {
  //     const entity: GroupEntity[] = await this.databaseService.group.getAllByProperties({})
  //   } catch (error) {}
  // }
}
