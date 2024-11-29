import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GroupReqDto } from 'src/core/dto/group/group.req-dto';
import { UpdateGroupDto } from 'src/core/dto/group/group.req-update-dto';
import { GroupResDto } from 'src/core/dto/group/group.res-dto';
import { GroupEntity } from 'src/core/entities/group/group';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { GroupUsecase } from 'src/use-cases/group/group.usecase';

@Controller('group')
@ApiTags('Group')
@UseGuards(AccessTokenGuard, RolesGuard)
export class GroupController {
  constructor(private readonly usecase: GroupUsecase) {}

  @Get('get-my-groups')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAll(
    @Request() request: RequestWithUser,
  ): Promise<IResponse<GroupResDto[]>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.usecase.getAll(userId);
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async create(
    @Request() request: RequestWithUser,
    @Body() dto: GroupReqDto,
  ): Promise<IResponse<GroupEntity>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.usecase.create(userId, dto);
    } catch (error) {
      throw error;
    }
  }

  @Patch('update')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async update(
    @Request() request: RequestWithUser,
    @Body() dto: UpdateGroupDto,
  ): Promise<IResponse<GroupEntity>> {
    try {
      const {
        user: { userId },
      } = request;
      return await this.usecase.update(userId, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<null>> {
    try {
      return await this.usecase.delete(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-one/:id')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IResponse<GroupEntity>> {
    try {
      return await this.usecase.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-all-members-in-group/:groupId')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAllMembersInGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<IResponse<GroupEntity>> {
    try {
      return await this.usecase.getAllMembersInGroup(groupId);
    } catch (error) {
      throw error;
    }
  }
}
