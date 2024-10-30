// src/infrastructure/controllers/group-members/group-member.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GroupMemberReqDto } from 'src/core/dto/group-members/group.req-dto';
import { GroupMemberResDto } from 'src/core/dto/group-members/group.res-dto';

import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { RolesGuard } from 'src/infrastructure/guards/roles/roles.guard';
import { GroupMemberUsecase } from 'src/use-cases/group-members/group-members.usecase';

@Controller('group-members')
@ApiTags('Group Members')
@UseGuards(AccessTokenGuard, RolesGuard)
export class GroupMemberController {
  constructor(private usecase: GroupMemberUsecase) {}

  @Post('create')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async create(
    @Body() dto: GroupMemberReqDto,
  ): Promise<IResponse<GroupMemberResDto>> {
    return await this.usecase.create(dto);
  }

  // @Get('get-all/:groupId')
  // @ApiBearerAuth()
  // @Roles(ROLES.ADMIN, ROLES.USER)
  // async getAll(
  //   @Param('groupId', ParseIntPipe) groupId: number,
  // ): Promise<IResponse<GroupMemberResDto[]>> {
  //   return await this.usecase.getAll(groupId);
  // }

  @Delete('delete/:membershipId')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async delete(
    @Param('membershipId', ParseIntPipe) membershipId: number,
  ): Promise<IResponse<null>> {
    return await this.usecase.delete(membershipId);
  }
}
