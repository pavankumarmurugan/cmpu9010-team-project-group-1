import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { IResponse } from 'src/core/interface/response.interface';
import { ConfigUsecase } from 'src/use-cases/config/config.usecase';

@Controller('config')
@ApiTags('Config')
export class ConfigController {
  constructor(private configUsecase: ConfigUsecase) {}

  // @Get('get')
  // @ApiExcludeEndpoint()
  // async config(): Promise<IResponse<any>> {
  //   return await this.configUsecase.get();
  // }
}
