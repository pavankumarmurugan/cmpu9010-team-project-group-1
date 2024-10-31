import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VtoImageSearchResDto } from 'src/core/dto/vto/vto.res-dto';

import { IResponse } from 'src/core/interface/response.interface';
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
}
