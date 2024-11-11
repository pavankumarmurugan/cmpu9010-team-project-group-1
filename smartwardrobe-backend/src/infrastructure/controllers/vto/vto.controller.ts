import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VtoImageSearchReqDto } from 'src/core/dto/vto/vto.req-dto';
import { VtoImageSearchResDto } from 'src/core/dto/vto/vto.res-dto';

import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { VtoImageSearchUsecase } from 'src/use-cases/vto/vto.usecase';

@Controller('vto-image-search')
@ApiTags('VTO Image Search')
export class VtoImageSearchController {
  constructor(private usecase: VtoImageSearchUsecase) {}

  @Get('get-all/:imageName')
  async getAll(
    @Param('imageName') imageName: string,
  ): Promise<IResponse<VtoImageSearchResDto[]>> {
    return await this.usecase.getAll(imageName);
  }

  @Post('get-all-v2')
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN, ROLES.USER)
  async getAllV2(
    @Body() vto: VtoImageSearchReqDto,
  ): Promise<IResponse<VtoImageSearchResDto[]>> {
    return await this.usecase.getAllV2(vto);
  }
}
