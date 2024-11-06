import { Controller, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AuthLoginResDto } from 'src/core/dto/auth/auth-res-dto.class';
import { IResponse } from 'src/core/interface/response.interface';
import { ConfigUsecase } from 'src/use-cases/config/config.usecase';

@Controller('config')
@ApiTags('Config')
export class ConfigController {
  constructor(private configUsecase: ConfigUsecase) {}

  @Post('get')
  async login(): Promise<IResponse<any>> {
    return await this.configUsecase.get();
  }
}
