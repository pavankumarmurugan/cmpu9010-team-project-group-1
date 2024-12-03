import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchHistoryReqDTO } from 'src/core/dto/search-history/search-history.req.dto';
import { SearchHistoryResDTO } from 'src/core/dto/search-history/search-history.res.dto';
import { RequestWithUser } from 'src/core/interface/request.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';
import { Roles } from 'src/infrastructure/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/infrastructure/guards/auth/accessToken.guard';
import { SearchHistoryUsecase } from 'src/use-cases/search-history/search-history.usecase';

@ApiTags('Search History')
@Controller('search-history')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@Roles(ROLES.ADMIN, ROLES.USER)
export class SearchHistoryController {
  constructor(private readonly usecase: SearchHistoryUsecase) {}

  @Get('get-all')
  async getSearchHistory(
    @Query('topN', new DefaultValuePipe(5), ParseIntPipe) topN: number,
    @Request() request: RequestWithUser,
  ): Promise<IResponse<SearchHistoryResDTO[]>> {
    const {
      user: { userId },
    } = request;
    return this.usecase.getLatestSearchHistory(userId, topN);
  }

  @Post('create')
  async addSearchHistory(
    @Request() request: RequestWithUser,
    @Body() dto: SearchHistoryReqDTO,
  ): Promise<IResponse<null>> {
    const {
      user: { userId },
    } = request;
    const { searchQuery } = dto;
    return this.usecase.addSearchHistory(userId, searchQuery);
  }
}
