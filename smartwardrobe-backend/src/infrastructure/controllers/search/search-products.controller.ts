import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SearchProductUsecase } from 'src/use-cases/search/search-products.usecase';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadSearchPictureService } from 'src/infrastructure/services/uploadProfilePicture/upload-search-picture';
import { SearchImageSimilarProductReqDto } from 'src/core/dto/search/search-image-similar-products-req-dto';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Controller('search')
@ApiTags('Search')
export class SearchSimilarProductsController {
  constructor(
    private usecase: SearchProductUsecase,
    private uploadSearchPictureService: UploadSearchPictureService,
  ) {}

  @Post('get-all-similar-products-to-image/:page/:limit')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Search Image picture upload',
    type: SearchImageSimilarProductReqDto,
  })
  async uploadPictureAndFindSimilarProducts(
    @UploadedFile() file: Multer.File,
    @Body() dto: SearchImageSimilarProductReqDto,
    @Param('page', ParseIntPipe) page: number = 1,
    @Param('limit', ParseIntPipe) limit: number = 10,
  ) {
    const { query } = dto;
    let fileUrl = '';
    if (file === undefined && query === '') {
      throw new BadRequestException(MESSAGES.SEARCH.NO_FILE_OR_QUERY);
    }

    if (file !== undefined) {
      fileUrl = await this.uploadSearchPictureService.uploadFile(file);
    }

    return await this.usecase.searchSimilarItemsToImage(
      fileUrl,
      query,
      page,
      limit,
    );
  }
}
